# Prioriza Method - Discrete Form

The **Discrete Prioriza Method** is the original and foundational version of the Prioriza framework. It assigns priority rankings to competing elements evaluated under several parameters without exhaustive pairwise comparison.

This chapter states the full discrete formulation: definitions, mathematical model, leveling functions, and interpretive notes.

---

## 1. Introduction

Consider two cities evaluated with two parameters: **distance** (we want smaller) and **population** (we want larger). Let City A have distance \(w\) and population \(x\); let City B have distance \(y\) and population \(z\).

| City | Distance | Population |
|------|----------|------------|
| A    | \(w\)    | \(x\)      |
| B    | \(y\)    | \(z\)      |

When comparing two values for a single parameter, there are exactly three possible relations: \(<\), \(=\), or \(>\). With two parameters, the pairwise comparison of City A versus City B yields \(3^2 = 9\) possible relational cases:

1. Distance: \(w < y\); Population: \(x < z\)
2. Distance: \(w < y\); Population: \(x = z\)
3. Distance: \(w < y\); Population: \(x > z\)
4. Distance: \(w = y\); Population: \(x < z\)
5. Distance: \(w = y\); Population: \(x = z\)
6. Distance: \(w = y\); Population: \(x > z\)
7. Distance: \(w > y\); Population: \(x < z\)
8. Distance: \(w > y\); Population: \(x = z\)
9. Distance: \(w > y\); Population: \(x > z\)

The factor 3 arises because a comparison of two values can only be less-than, equal, or greater-than. With \(m\) parameters, the number of comparison patterns for any pair of elements is \(3^m\). Extending to \(n\) elements, there are \(n!\) possible total orderings of all elements. The size of the comparison universe therefore grows on the order of:

$$
3^m \times n!
$$

This growth is super-exponential in \(m\) and \(n\), making exhaustive exploration impractical even for modest problem sizes. Therefore, instead of analyzing every possible combination, we need a systematic and efficient way to assign priorities—this motivates the Prioriza Method.

![Combinatorial explosion surface \(3^m \times n!\)](/images/combinatorial-explosion.png)

---

## 2. Fundamental Concepts

The discrete method relies on four core concepts: elements, parameters, values, and priority levels.

### 2.1 Element
An **element** is any object or option being evaluated.

Examples: city, course activity, machine, project.

$$
E = \{ e_1, e_2, \ldots, e_n \}
$$

### 2.2 Parameter
A **parameter** is a criterion used to evaluate elements.

Examples: distance, number of restrictions, population, cost, urgency.

$$
P = \{ p_1, p_2, \ldots, p_m \}
$$

### 2.3 Value
The **value** of element $e_i$ under parameter $p_j$ is:

$$
v_{ij}
$$

Values are mapped into $\mathbb{R}$; only the order relations (greater, less, equal) matter.

### 2.4 Priority Level
A **priority level** is a positive integer:

- Level 1 = highest priority (best)
- Level $k$ = lower priority

Multiple values may share the same level to preserve ties.

---

## 3. Mathematical Model of the Discrete Method

The method transforms raw values $v_{ij}$ into:

- $L$: matrix of discrete priority levels
- $w$: vector of parameter weights
- $W$: matrix of weighted priority levels
- $P$: vector of global priorities

### 3.1 Leveling Function

For each parameter $p_j$:

$$
\text{level}_j : v_{ij} \mapsto L_{ij}
$$

Rules:
1. Choose the criterion: minimize (lower is better) or maximize (higher is better).
2. The best value receives level 1.
3. Equal values share the same level.
4. The level increases only when the value changes.

### 3.2 Level Matrix $L$

$$
L =
\begin{bmatrix}
L_{11} & L_{12} & \cdots & L_{1m} \\
L_{21} & L_{22} & \cdots & L_{2m} \\
\vdots & \vdots & \ddots & \vdots \\
L_{n1} & L_{n2} & \cdots & L_{nm}
\end{bmatrix}
$$

Rows correspond to elements; columns correspond to parameters.

### 3.3 Parameter Weights $w_j$

Each parameter weight is positive:

$$
w_j > 0
$$

The weight vector is:

$$
\mathbf{w} = [\, w_1, w_2, \ldots, w_m \,]
$$

### 3.4 Weighted Level Matrix $W$

$$
W_{ij} = L_{ij} \cdot w_j
$$

$$
W =
\begin{bmatrix}
W_{11} & W_{12} & \cdots & W_{1m} \\
W_{21} & W_{22} & \cdots & W_{2m} \\
\vdots & \vdots & \ddots & \vdots \\
W_{n1} & W_{n2} & \cdots & W_{nm}
\end{bmatrix}
$$

### 3.5 Global Priority $P_i$

For each element $e_i$:

$$
P_i = \sum_{j=1}^m W_{ij} = \sum_{j=1}^m \bigl( L_{ij} \cdot w_j \bigr)
$$

### 3.6 Prioritized Element

$$
e^* = \arg\min_i P_i
$$

Ties are preserved if multiple elements share the minimal score.

---

## 4. Construction of Levels

Two base forms:

- **Minimization leveling**: lower values get better levels.
- **Maximization leveling**: higher values get better levels.

### 4.1 Minimization Rule

Given values:

$$
v_{1j}, v_{2j}, \ldots, v_{nj}
$$

Sort ascending:

$$
v_{(1)j} \le v_{(2)j} \le \ldots \le v_{(n)j}
$$

Assign levels:

- Level 1 for the smallest value.
- Increase the level only when the value increases.

### 4.2 Maximization Rule

Same procedure, but sorting in descending order.

### 4.3 Equality Handling

If two values satisfy $v_{ij} = v_{kj}$, then $L_{ij} = L_{kj}$, preserving ordinal equivalence.

---

## 5. Interpretation of the Discrete Method

The discrete form is an ordinal multi-criteria decision model: each parameter contributes a weighted layer, and the final priority is the sum of those layers. It is deterministic, simple, and efficient, akin to rank aggregation but with explicit leveling.

---

## 6. Canonical Example

Two cities evaluated under distance (minimize) and population (maximize):

| City | Distance | Population |
|------|----------|------------|
| A    | 30       | 1000       |
| B    | 20       | 5000       |

### Step 1 - Leveling

**Distance (minimize)**  
- B = 20 -> level 1  
- A = 30 -> level 2  

**Population (maximize)**  
- B = 5000 -> level 1  
- A = 1000 -> level 2  

### Step 2 - Weighted Levels (weights = 1)

$$
W_{ij} = L_{ij} \cdot 1
$$

### Step 3 - Global Priorities

$$
P_A = 2 + 2 = 4
$$
$$
P_B = 1 + 1 = 2
$$

### Winner

$$
e^* = B
$$

---

## 7. Advantages of the Discrete Method

- Avoids combinatorial explosion $3^{n \cdot m}$
- Stable under numeric noise
- Preserves ties naturally
- Parameters can be added without altering the framework
- Computationally efficient
- Works with incomplete information
- Easy to explain and justify
- Directly applicable to scheduling, allocation, and prioritization systems

---

## 8. Summary

The discrete version of the Prioriza Method provides a robust, efficient, and mathematically clear mechanism for prioritizing elements under multiple criteria. It is the foundation for the continuous version and the applied algorithms used in resource allocation and timetable generation.
