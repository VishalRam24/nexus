# nexus-opt — User Guide

**One modelling API. Rust core. Every problem class.**

`nexus-opt` is a Python optimisation library with a Rust core. You write the
model once — variables, constraints, an objective — and the same API covers
linear, mixed-integer, quadratic, conic, nonlinear, black-box, multi-objective
and stochastic programming. Changing problem class does not mean changing
library.

If you want the energy-system modelling layer rather than the solver, start at
[nexus-energy](https://github.com/VishalRam24/nexus-energy) — it is built on
this core and installs it for you.

> **Every code block in this guide has been executed against a clean install.**
> Where a printed result is shown, that is the actual output.

---

## Contents

1. [Install and verify](#1-install-and-verify)
2. [Your first model](#2-your-first-model)
3. [Building models](#3-building-models) — variables, expressions, constraints, objectives
4. [Reading results](#4-reading-results)
5. [Problem classes](#5-problem-classes) — LP, MILP, QP, conic, nonlinear
6. [Black-box optimisation](#6-black-box-optimisation) — DE, PSO, SA, CMA-ES
7. [Multi-objective, stochastic and combinatorial](#7-multi-objective-stochastic-and-combinatorial)
8. [Diagnostics](#8-diagnostics) — why a model is infeasible, why a variable took its value
9. [Solver options](#9-solver-options)
10. [Repeated re-solves with PersistentHighs](#10-repeated-re-solves-with-persistenthighs)
11. [Scaling out](#11-scaling-out)
12. [Import, export and validation](#12-import-export-and-validation)
13. [Performance guide](#13-performance-guide)
14. [Architecture](#14-architecture)
15. [Known issues and honest scope](#15-known-issues-and-honest-scope)
16. [API index](#16-api-index)

---

## 1. Install and verify

```bash
pip install nexus-opt
```

Prebuilt wheels cover Linux (glibc and musl; x86_64 / aarch64 / i686), macOS
(arm64 and x86_64) and Windows (x64 and x86). The crate builds as an **abi3**
extension, so one wheel per platform serves every CPython from 3.9 up, and no
Rust toolchain is needed to install.

Verify the install:

```python
import nexus_opt as nx

m = nx.Model()
x = m.variable("x", lower=0)
m.add(x >= 5)
m.minimize(x)
print(m.solve().objective)      # 5.0
```

> **Import `nexus_opt`, not `nexus`.** A short `nexus` alias package exists in
> the source tree for development, but it is not shipped in the wheel. On a
> `pip install`, `import nexus` will fail.

### Building from source

```bash
git clone https://github.com/VishalRam24/nexus-opt
cd nexus-opt
maturin build --release
pip install target/wheels/*.whl
```

Needs a Rust toolchain. Run the tests with `uv run pytest`.

---

## 2. Your first model

A two-variable linear program: meet a demand of 10 units as cheaply as
possible, where `x` costs 2 per unit but is capped at 6, and `y` costs 3.

```python
import nexus_opt as nx

m = nx.Model()
x = m.variable("x", lower=0)
y = m.variable("y", lower=0)

m.add(x + y >= 10)      # meet demand
m.add(x <= 6)           # x is capacity-limited
m.minimize(2 * x + 3 * y)

r = m.solve()
print(r.status, r.objective, r.value(x), r.value(y))
```

```
optimal 24.0 6.0 4.0
```

That is the whole shape of the library: build a `Model`, declare variables,
`add()` constraints written with ordinary Python comparison operators, state an
objective, call `solve()`, read values off the result.

There is no separate "compile" step and no solver-specific syntax. Constraints
compile straight into Rust structures as you write them.

---

## 3. Building models

### Variables

| Call | Kind | Notes |
|---|---|---|
| `m.variable(name, lower=…, upper=…)` | continuous | bounds default to `(-inf, +inf)` |
| `m.integer(name, lower=…, upper=…)` | integer | |
| `m.binary(name)` | binary | equivalent to an integer in `[0, 1]` |
| `m.variables(prefix, count, lower=…, upper=…)` | list of continuous | bulk creation |
| `m.integers(prefix, count, lower=…, upper=…)` | list of integers | bulk creation |

```python
m = nx.Model("kinds")
c = m.variable("c", lower=0.0, upper=10.0)
i = m.integer("i", lower=0, upper=5)
b = m.binary("b")

xs = m.variables("x", 4, lower=0.0, upper=3.0)   # x0 … x3
```

### Expressions

Variables support `+`, `-`, `*`, `/` and `**` with ordinary Python operators.
Multiplying two variables produces a `QuadExpr`; `sin`, `cos` and `sqrt`
produce an `NlExpr`.

```python
linear    = 2 * x + 3 * y - 4
quadratic = w1**2 + 0.5 * (w1 * w2)
nonlinear = nx.sin(x) + nx.sqrt(y)
```

> **Gotcha — parenthesise scalar × variable × variable.** Python evaluates
> `0.05 * w1 * w2` left to right as `(0.05 * w1) * w2`, which is a linear
> expression multiplied by a variable, and raises
> `ValueError: Expr can be multiplied by a scalar or NlExpr`. Write
> `0.05 * (w1 * w2)` instead.

Use `nx.sum()` rather than Python's built-in `sum()` for collections — it
reduces the expression inside Rust in one pass instead of building `N`
intermediate Python objects:

```python
xs = [m.variable(f"x{i}", lower=0, upper=1) for i in range(5)]
m.add(nx.sum(xs) >= 2.5)
m.minimize(nx.sum(xs))
```

### Constraints

`m.add(expr, name=None)` accepts `<=`, `>=` and `==` comparisons. Naming a
constraint is optional but is what makes the diagnostics in
[section 8](#8-diagnostics) readable.

```python
m.add(2 * c + 3 * i - b <= 12.0, name="resource")
m.add(c + i >= 2.0, name="demand")
```

### Objectives

```python
m.minimize(expr)
m.maximize(expr)
```

---

## 4. Reading results

`solve()` returns a `Result`:

| Attribute | Meaning |
|---|---|
| `r.status` | `"optimal"`, `"infeasible"`, `"unbounded"`, `"unknown"` |
| `r.is_optimal` | convenience boolean |
| `r.objective` | objective value at the optimum |
| `r.value(var)` | value of one variable |
| `r.primals` | all primal values, in variable-creation order |
| `r.var_names_list` | variable names, in the same order |

```python
r = m.solve()
if r.is_optimal:
    print(r.objective, r.value(x))
    print(dict(zip(r.var_names_list, r.primals)))
```

**Always check `r.status` before reading `r.objective`.** On a non-optimal
solve, `objective` may be `None`.

Duals and shadow prices come from `r.sensitivity()` — see
[section 8](#8-diagnostics).

---

## 5. Problem classes

The solver is chosen automatically from the model's structure. You can override
it with `solve(solver=…)`, but you rarely need to.

| Model contains | Routed to |
|---|---|
| linear only | HiGHS (simplex / IPM) |
| any integer or binary variable | HiGHS MIP |
| quadratic objective terms | HiGHS QP |
| any cone constraint | Clarabel |
| `sin` / `cos` / `sqrt` / division | Ipopt |

### Mixed-integer linear (MILP)

```python
m = nx.Model("Knapsack")
x = m.variable("x", lower=0.0, upper=10.0)
y = m.integer("y", lower=0, upper=5)
z = m.binary("z")

m.add(2 * x + 3 * y - z <= 12.0, name="resource_limit")
m.add(x + y >= 2.0, name="min_demand")
m.maximize(5 * x + 6 * y + 2 * z)

r = m.solve()
print(r.status, r.objective, r.value(x), r.value(y), r.value(z))
```

```
optimal 34.5 6.5 0.0 1.0
```

### Quadratic (QP)

Quadratic terms appear automatically when variables are multiplied together or
squared.

```python
m = nx.Model("QP_Portfolio")
w1 = m.variable("w1", lower=0, upper=1)
w2 = m.variable("w2", lower=0, upper=1)

m.add(w1 + w2 == 1.0, name="allocation")
m.minimize(0.1 * w1**2 + 0.2 * w2**2 + 0.05 * (w1 * w2))
#                                     ^^^^^^^^^^^^^^^^^ note the parentheses

r = m.solve()
```

### Conic (SOCP / PSD)

A model containing any cone auto-routes to Clarabel — no `solver=` argument.

```python
m = nx.Model("SOCP_Demo")
t  = m.variable("t", lower=0)
x1 = m.variable("x1")
x2 = m.variable("x2")

m.add_soc_cone([t, x1, x2])     # imposes t >= ||(x1, x2)||_2
m.add(x1 >= 3.0)
m.add(x2 >= 4.0)
m.minimize(t)

print(m.solve().objective)      # 5.0  — the 3-4-5 triangle
```

`add_soc_cone` takes `[head, x_1, …, x_k]` and needs at least two variables.

PSD cones take the lower-triangular entries of a `d × d` symmetric matrix —
exactly `d(d+1)/2` variables:

```python
m.add_psd_cone([s11, s21, s22])
```

`quad_form(model, x_vars, P)` builds `xᵀPx` for a PSD matrix `P`, validating
positive-semidefiniteness and raising `ValueError` otherwise:

```python
from nexus_opt import quad_form

expr = quad_form(m, [x1, x2], [[2.0, 0.5], [0.5, 1.0]])
m.minimize(expr)
```

### Nonlinear (NLP)

`sin`, `cos`, `sqrt` and division are first-class expression operators, not
wrappers. Nonlinear constraints live in a parallel container, so the LP/QP
presolve path stays untouched and bit-identical.

```python
m = nx.Model("NLP_Model")
x = m.variable("x", lower=0.1, upper=5.0)
y = m.variable("y", lower=0.1, upper=5.0)

m.add(x / y <= 2.0, name="ratio_bound")
m.minimize(nx.sin(x) + nx.cos(y) + nx.sqrt(x))

r = m.solve()
```

---

## 6. Black-box optimisation

For objectives that are non-convex, non-differentiable, or wrap a simulation,
the metaheuristics take a plain Python callable and a list of bounds. They run
compiled parallel populations in Rust.

```python
# Differential evolution — a good default for rugged landscapes
r = nx.solve_de(
    func=lambda v: (v[0] - 3)**2 + (v[1] - 4)**2,
    bounds=[(-10.0, 10.0), (-10.0, 10.0)],
    pop_size=50,
    max_generations=500,
    f=0.5,          # mutation scale
    cr=0.7,         # crossover rate
    seed=42,
)
print(r.x, r.objective)     # [3.0000, 4.0000] 1.2e-10
```

The others share the same shape:

```python
nx.solve_pso(func, bounds, pop_size=30, max_iterations=500)     # particle swarm
nx.solve_sa(func, bounds, max_iterations=10000)                 # simulated annealing
nx.solve_cmaes(func, bounds, variant="full", restarts=2)        # CMA-ES
```

| Algorithm | Reach for it when |
|---|---|
| `solve_de` | general-purpose global search; the default choice |
| `solve_pso` | flat valleys, cheap objective evaluations |
| `solve_sa` | deep narrow canyons, single-state search |
| `solve_cmaes` | ill-conditioned continuous spaces; `variant="full"` for full covariance with IPOP restarts |

**If you do not know which will win**, race them:

```python
r = nx.solve_portfolio(lambda v: (v[0] - 2.5)**2, [(-10, 10)], max_evals=2000)
```

`solve_portfolio` runs the algorithms concurrently against the same objective
and returns the best result.

---

## 7. Multi-objective, stochastic and combinatorial

### Pareto frontiers

`pareto_frontier` keeps a weighted-sum path for two objectives and routes to
native NSGA-II / NSGA-III when `method` is passed explicitly or when there are
three or more objectives (NSGA-III by default at four or more).

```python
front = nx.pareto_frontier(
    objectives=[f1, f2, f3],        # callables: list[float] -> float
    bounds=[(-5, 5)] * 4,
    n_points=30,
    method="nsga3",                 # "nsga2" | "nsga3" — optional
    generations=300,
    das_dennis_divisions=12,        # NSGA-III reference-point density
    pop_size=150,                   # defaults to n_points * 5
    seed=42,
)
```

### Scenario-based stochastic programming

Minimise expected cost across discrete scenarios:

```python
def cost(x, scenario):
    order, demand = x[0], scenario["demand"]
    return 1.0 * max(0, order - demand) + 5.0 * max(0, demand - order)

r = nx.stochastic_solve(
    cost,
    bounds=[(0, 20)],
    scenarios=[{"demand": d} for d in (8, 10, 12, 14)],
    pop_size=40,
    max_generations=300,
)
print(r.x)      # [14.0] — shortage costs 5x holding, so hedge high
```

### Travelling salesman

`solve_tsp_lazy` adds DFJ subtour-elimination constraints lazily and returns a
`TspResult`:

```python
from nexus_opt import solve_tsp_lazy

res = solve_tsp_lazy(distance_matrix)
print(res.tour)
```

---

## 8. Diagnostics

Production models fail. These three tools are why this library exists in its
current shape.

### Why is my model infeasible?

When `status == "infeasible"`, `infeasibility_report()` isolates the
conflicting subset of constraints and bounds.

```python
m = nx.Model("Infeasible_Setup")
x = m.variable("x", lower=10)
y = m.variable("y", lower=5)
m.add(x + y <= 8, name="demand_cap")     # impossible: x + y >= 15
m.minimize(x + y)

r = m.solve()
if r.status == "infeasible":
    report = r.infeasibility_report()
    print(report["constraint_names"])     # ['demand_cap']
    print(report["explanation"])
    print(report["suggestions"])
```

Name your constraints. An unnamed constraint shows up as `c0`, `c1`, … and the
report becomes much harder to act on.

### Why did this variable take that value?

```python
m = nx.Model("Binding_Setup")
x = m.variable("x", lower=0, upper=100)
m.add(x <= 50, name="grid_limit")
m.minimize(-x)

r = m.solve()
print(r.why(x))
# x = 50.000000 is determined by binding constraint(s): grid_limit

print(r.why_detail(x)["binding_constraints"])
# [(0, 'grid_limit')]
```

`why()` returns a sentence; `why_detail()` returns a dict for automated
reporting.

### Shadow prices

```python
r = m.solve()
sens = r.sensitivity()
```

`sensitivity()` returns four keys:

| Key | Contents |
|---|---|
| `shadow_prices` | `(index, name, dual)` per constraint |
| `most_impactful` | the five constraints with the largest absolute dual |
| `active_constraints` | `(index, name)` for constraints binding at the optimum |
| `variable_bounds` | `(name, status)` — `"between"`, at lower, or at upper |

```python
for idx, name, price in sens["shadow_prices"]:
    print(f"{name}: {price}")
# floor: 2.0
```

---

## 9. Solver options

All of these are lossless — they change how the solve is performed, not what
the optimum is.

| Kwarg | Type / values | Effect |
|---|---|---|
| `solver` | `"highs"`, `"ipopt"`, … | force a specific solver; normally inferred |
| `time_limit` | seconds | stop and report the incumbent |
| `gap` | float | MIP relative gap tolerance |
| `verbose` | bool | solver log to stdout |
| `presolve` | bool, default `True` | run presolve |
| `solver_method` | HiGHS `solver` string | `"simplex"`, `"ipm"`, `"pdlp"`, `"choose"` |
| `run_crossover` | `"on"` / `"off"` / `"choose"` | IPM crossover; `"on"` recovers an exact vertex and duals |
| `parallel` | `"on"` / `"off"` / `"choose"` | HiGHS parallel dual simplex — same algorithm, bit-exact |
| `scale_cleanup` | bool | snap finite bounds/RHS with `0 < abs(v) < 1e-9` to exactly 0 |
| `simplex_scale_strategy` | int 0–5 | HiGHS matrix equilibration |
| `eliminate_redundant` | bool | drop rows whose attainable activity interval sits strictly inside their limits — provably non-binding |
| `warm_start` | a `Result`, or a raw list of floats | forwarded to HiGHS `setSolution()` for MIP warm-start |
| `basis` | basis object | simplex hot-start |
| `threads` | int | worker threads — **see the warning below** |

```python
r = m.solve(time_limit=30.0, presolve=True, solver_method="simplex")
```

> ⚠ **Known bug — the first `solve(threads=N)` in a process can return
> `status="unknown"`.** HiGHS builds its global task scheduler once per
> process; the library tears it down with `resetGlobalScheduler` when the
> thread count changes, and the solve immediately following that reset can come
> back with no result. Subsequent solves are fine. Until this is fixed, either
> leave `threads` unset, or issue one throwaway solve before the one whose
> answer you need, and check `r.status` either way.

### Warm-starting a MIP

```python
r1 = m.solve()
r2 = m.solve(warm_start=r1)     # or warm_start=[…]  (length = variable count)
```

A raw array must have length equal to the model's variable count.

### MIP correctness guard

HiGHS 1.14.0 mis-presolves *degenerate mixed continuous+integer* MIPs — it
returns a wrong "optimal" at gap 0. This reproduces through a one-shot LP-file
read, so it is a solver bug rather than an API issue.

The mitigation is built into `solve()`: for MIPs routed to HiGHS with
`num_vars <= 4000`, the LP relaxation is solved first (LP presolve is correct);
if its optimum is integer-feasible then it *is* the MIP optimum and is returned
directly, bypassing the buggy path. Large MIPs with fractional relaxations fall
through unchanged, so there is no speed cost. `presolve="off"` is always
correct. Guard test: `tests/test_milp_presolve_known_issue.py`.

---

## 10. Repeated re-solves with PersistentHighs

If you are solving a *sequence* of related problems — a rolling horizon, a
calibration loop, a parameter sweep — rebuilding the model each time is waste.
`PersistentHighs` keeps a loaded HiGHS instance alive so each re-solve
hot-starts from the retained simplex basis.

```python
import nexus_opt as nx

m = nx.Model()
x = m.variable("x", lower=0, upper=100)
y = m.variable("y", lower=0, upper=100)
m.add(x + y >= 10, name="demand")
m.minimize(2 * x + 3 * y)

ph = nx.PersistentHighs.from_model(model=m, verbose=False, time_limit=60.0)

r1 = ph.resolve()
print(r1.objective)                  # 20.0

ph.update_col_costs([0], [9.0])      # x now costs 9 instead of 2
r2 = ph.resolve()
print(r2.objective)                  # 30.0
```

In-place update methods (indices are column / row positions):

| Method | Updates |
|---|---|
| `update_col_bounds(idx, lower, upper)` | variable bounds |
| `update_row_bounds(idx, lower, upper)` | constraint RHS |
| `update_col_costs(idx, costs)` | objective coefficients |
| `update_matrix_coeffs(rows, cols, values)` | matrix entries — expert API |

Mirrors of the currently-loaded state, so callers can compute exact deltas
without re-deriving the model:

```python
row_lo, row_hi = ph.row_bounds()
col_lo, col_hi = ph.col_bounds()
costs = ph.col_costs()
print(ph.num_cols(), ph.num_rows())
```

Two things to know:

- **Presolve is disabled** inside the persistent instance. It has to be —
  stable row and column indexing is the whole point.
- **`var_names_list` comes back empty** on a `resolve()` result. Read values
  positionally from `r.primals`, using the column order of the model you built.

`update_matrix_coeffs` is an expert API: you are responsible for keeping any
mirrored higher-level model consistent with it.

---

## 11. Scaling out

### Parallel differential evolution

```python
r = nx.solve_parallel_de(func, bounds, pop_size=40, max_generations=100)
```

### Consensus ADMM

ADMM solves large decoupled problems across sub-agents without any agent
sharing its private objective parameters. Each sub-problem is a callable
`(rho, target) -> list[float]`, and they converge on a shared consensus
variable `z`.

```python
def agent1(rho, target):        # wants z near 3
    return [(2 * 3 + rho * target[0]) / (2 + rho)]

def agent2(rho, target):        # wants z near 7
    return [(2 * 7 + rho * target[0]) / (2 + rho)]

r = nx.solve_admm(
    subproblems=[agent1, agent2],   # note: subproblems, not sub_problems
    dim=1,                          # dimensionality of the consensus variable
    rho=1.0,                        # augmented-Lagrangian penalty
    max_iter=200,
)
print(r["z"])       # ~5.0 — the midpoint
```

---

## 12. Import, export and validation

### Structural summary and validation

Before solving, check the shape of what you built:

```python
print(m.summary())
# Model 'export': 1 vars (1 cont, 0 int, 0 bin), 1 constraints (0 <=, 1 >=, 0 ==), …

for w in m.validate():
    print(f"[{w['severity']}] {w['code']} — {w['message']}")
```

`validate()` flags dangling variables, unconstrained spaces and extreme
coefficients. An empty list means nothing suspicious was found.

### LP export

```python
lp_string = m.to_lp()       # standard CPLEX LP format
```

### Python code generation

`to_python()` emits a self-contained script that rebuilds the identical model —
useful for a reproducible bug report or for handing a colleague the exact
mathematical layout.

```python
with open("reproduced_model.py", "w") as f:
    f.write(m.to_python())
```

---

## 13. Performance guide

1. **Use `nx.sum()`, not Python's `sum()`.** The built-in performs sequential
   pairwise additions, creating `O(N)` intermediate Python objects and crossing
   the PyO3 boundary each time. `nx.sum(vars)` reduces the collection inside
   Rust in one pass.
2. **Reuse the model for repeated solves.** `PersistentHighs` (section 10)
   replaces rebuild-and-cold-solve with an in-place parameter update and a
   hot-started re-solve. On a rolling horizon this is the single largest win
   available.
3. **Leave `presolve` on.** It defaults to `True`, and `eliminate_redundant`
   runs an exact nexus-side row-elimination pass alongside it. Both are
   optimum-preserving.
4. **Let the solver be inferred.** Forcing `solver=` bypasses the routing that
   picks Clarabel for cones and Ipopt for nonlinear expressions.
5. **Name your constraints.** No runtime cost, and it is the difference between
   a usable and a useless infeasibility report.

---

## 14. Architecture

```
┌────────────────────────────────────────────────────────┐
│                      Python API                        │
│  (model building, operator overloading, diagnostics)   │
└──────────────────────────┬─────────────────────────────┘
                           │ PyO3 bindings
┌──────────────────────────▼─────────────────────────────┐
│                       Rust core                        │
│  (flat sparse arrays, expression compiler, parallel    │
│   constraint assembly via Rayon)                       │
└──────────────────────────┬─────────────────────────────┘
                           │ FFI
┌──────────────────────────▼─────────────────────────────┐
│                     Solver backends                    │
│              (HiGHS, Clarabel, Ipopt)                  │
└────────────────────────────────────────────────────────┘
```

Traditional Python optimisation libraries spend most of their time *building*
the model — millions of constraints assembled through nested Python loops.
`nexus-opt` keeps the modelling layer and sparse representation in Rust. Python
expressions built through operator overloading compile directly into Rust
structures (`LinExpr`, `QuadExpr`, `NlExpr`), and at `solve()` time the sparse
constraint matrices are assembled in parallel and streamed into the backend.

Third-party solvers appear in `benchmarks/` as comparison rows only. They are
never wrapped inside the library.

---

## 15. Known issues and honest scope

- **`solve(threads=N)`** can return `status="unknown"` on the first call in a
  process — see the warning in [section 9](#9-solver-options).
- **No GPU backend.** `Model.solve()` accepts no `gpu` argument. Earlier
  documentation described a cuPDLP-C / cuOpt path here; it is not in this
  library. (`nexus-energy` exposes an `lp_backend="gpu"` option that probes for
  cuOpt and falls back to CPU when it is absent.)
- **`sensitivity()` returns no reduced costs.** The four keys it does return
  are listed in [section 8](#8-diagnostics).
- **`PersistentHighs` results carry no variable names** — read `r.primals`
  positionally.
- **`src/presolve.rs` is unused.** `eliminate_redundant` is the presolve pass
  actually wired into the solve path.

### Benchmarks

`benchmarks/` holds the comparison harness and stored results
(`benchmarks/_results/*.jsonl`) against scipy, cvxpy, PuLP, Pyomo, Optuna and
Nevergrad. Numbers are re-runnable rather than quoted.

---

## 16. API index

Everything exported from the top-level `nexus_opt` namespace.

### Core types

| Name | What it is |
|---|---|
| `Model` | the model container |
| `Var`, `Expr`, `QuadExpr`, `NlExpr` | expression types |
| `Constraint` | a compiled constraint |
| `Result` | solve result |
| `BlackBoxResult` | metaheuristic result (`.x`, `.objective`) |
| `TspResult` | TSP result (`.tour`) |
| `PersistentHighs` | in-place re-solve session |

### Model methods

`variable` · `integer` · `binary` · `variables` · `integers` · `add` ·
`add_soc_cone` · `add_psd_cone` · `minimize` · `maximize` · `solve` ·
`summary` · `validate` · `to_lp` · `to_python`

### Result methods

`status` · `is_optimal` · `objective` · `value` · `primals` ·
`var_names_list` · `sensitivity` · `why` · `why_detail` ·
`infeasibility_report`

### Functions

| Name | Purpose |
|---|---|
| `sum`, `minimize`, `maximize` | expression helpers |
| `sin`, `cos`, `sqrt` | nonlinear operators |
| `quad_form(model, xs, P)` | build `xᵀPx`, validating PSD |
| `solve_de`, `solve_pso`, `solve_sa`, `solve_cmaes` | metaheuristics |
| `solve_portfolio` | race the metaheuristics |
| `solve_parallel_de` | parallel differential evolution |
| `solve_admm` | consensus ADMM |
| `pareto_frontier` | multi-objective frontier (NSGA-II / III) |
| `stochastic_solve` | scenario-based expectation minimisation |
| `solve_tsp_lazy` | TSP with lazy subtour elimination |

---

## Licence

MIT. The design and layout of the project site follow Notus React (Creative
Tim, MIT); see `LICENSE` for retained notices.
