## Procedure

### In Real Laboratory

The experiment is conducted by measuring the torque required to maintain a constant angular velocity $\omega$ under two conditions: (1) with no water flow, and (2) with a measured water flow.

#### Setup Phase
1. Fill the water reservoir tank with sufficient water.
2. Ensure that the coupling turns freely by hand.
3. Ensure the spring balance is set to **zero** (or note the initial reading) while the motor is stationary and the pipes are free to rotate.

#### Part 1: No-Flow Torque Measurement $(T_{nf})$
4. Turn on the motor and adjust the speed regulator to achieve a desired constant speed, N (e.g., 150 RPM).
5. With no water flowing (pump is OFF), measure the Torque required for free rotation of the tubes at that speed N. Record this reading from the spring balance as **Spring Balance Reading** $F_{nf}$ (No Flow).
   - *Note: The torque arm pointer must coincide with the stationary pointer before taking the reading.*

#### Part 2: Flow Torque Measurement $(T_f)$
6. Turn on the pump. Adjust the flow rate using the by-pass valve so that water does not overflow through the central tube and the pipes run full of water.
7. Check and adjust the motor speed back to the previous value, N.
8. With water flowing, measure the Torque required to maintain the constant speed $N$. Record this reading from the spring balance as **Spring Balance Reading** $F_f$ (Flow).
9. Note down the water flow rate, Q, from the Rotameter in LPH (Litres Per Hour).

#### Data Collection
10. Calculate the net torque difference due to Coriolis force: $\Delta F = F_f - F_{nf}$
11. Repeat the procedure (Steps 4 through 9) at two or more different motor speeds, N, and fill the observations in the table provided.
12. Use the derived formulas (Theoretical and Practical) to compare the Coriolis components of acceleration.

### In Simulator
1. Adjust the initial setup parameters (angular speed $N$ and flow rate $Q$) using the sliders to set the experimental conditions.
2. Lock the experimental setup and click the **Play** button.
3. The torque reading will stabilize automatically.
4. The tabulated results, including the calculated Coriolis components of acceleration, are available for reference once the experiment is completed.

---

## Observations

| S.N. | Speed N (RPM) | Spring Balance (kg) | Water Flow Q (LPH) |
|------|---------------|---------------------|--------------------|
|      |               | $F_{nf}$ | $F_f$ |                    |
|------|---------------|----------|--------|--------------------|
| 1    |               |          |        |                    |
| 2    |               |          |        |                    |
| 3    |               |          |        |                    |
| 4    |               |          |        |                    |

---

## Calculation

To calculate the Theoretical and Practical (Measured) Coriolis Acceleration $(a_c)$ and the percentage error between the two values.

### 1. Constants and Measured Variables

#### A. Given Specifications and Constants

| Variable | Definition | Value | Unit |
|----------|------------|-------|------|
| Tube Inner Diameter ($D$) | Bore diameter of one tube | 8 mm = 0.008 | m |
| Effective Length ($L$) | Effective length of the tubes | 0.312 | m |
| Torque Arm Radius ($l$) | Length of the torque arm | 0.112 | m |
| Gravity Constant ($g$) | Acceleration due to gravity | 9.81 | ${m/s}^{2}$ |
| Mass Density ($\rho$) | Mass density of water (assumed) | 1000 | ${kg/m}^{3}$ |

#### B. Observed Variables (from Data Collection)

| Variable | Description | Symbol | Unit |
|----------|-------------|--------|------|
| Speed | Rotational speed of the tubes | $N$ | RPM |
| No-Flow Spring Reading | Spring Balance reading with motor ON, pump OFF | $F_{nf}$ | kg |
| Flow Spring Reading | Spring Balance reading with motor ON, pump ON | $F_f$ | kg |
| Flow Rate | Water flow rate | $Q_{LPH}$ | LPH |

### 2. Step-by-Step Calculation

The calculations should be performed for each data set (each rotational speed N).

#### Step 2.1: Calculate Geometric and Kinematic Variables

| Variable | Formula | Calculation | Unit |
|----------|---------|-------------|------|
| **Area of one tube ($a_1$)** | $a_1 = \frac{\pi D^{2}}{4}$ | $a_1 = \frac{\pi{(0.008)}^{2}}{4} = 5.026 \times 10^{-5}$ | $m^{2}$ |
| **Total Flow Area ($a_{total}$)** | $a_{total} = 2 \cdot a_1$ (For two tubes) | $a_{total} = 2 \cdot (5.026 \times 10^{-5}) = 1.005 \times 10^{-4}$ | $m^{2}$ |
| **Flow Rate ($Q$)** | $Q = \frac{Q_{LPH}}{3.6 \times 10^{6}}$ | $Q = \frac{Q_{LPH}}{36,00,000}$ | $m^{3}/s$ |
| **Flow Velocity (V)** | $V = \frac{Q}{a_{total}}$ | $V = \frac{Q}{1.005 \times 10^{-4}}$ | $m/s$ |
| **Angular Velocity ($\omega$)** | $\omega = \frac{2\pi N}{60}$ | $\omega = \frac{2\pi N}{60}$ | $rad/s$ |

#### Step 2.2: Theoretical Coriolis Acceleration ($a_{c,\ theo}$)

Use the Kinematic formula (Equation 5 from Theory):

$$\mathbf{a_{c,\ theo} = 2\ V\omega}$$

#### Step 2.3: Net Torque ($T$)

The net force difference due to the Coriolis effect ($\Delta F$) is found first, and then converted to torque $T$ in $N \cdot m$

1. **Mass Difference ($\Delta F_{mass}$):**

$\Delta F_{mass} = F_f - F_{nf}$ (in kg)

2. **Torque ($T$):** (Force in Newtons × Radius $l$)

$$T = (\Delta F_{mass} \cdot g) \cdot l$$

*Where $\Delta F_{mass}$ is the reading difference in $kg$ and $l$ is 0.112 $m$.*

#### Step 2.4: Practical Coriolis Acceleration ($a_{c,\ prac}$)

Use the Hydraulic Analogy formula (Equation 7 from Theory), where $T$ is in $N \cdot m$ and $\rho$ is mass density ${(kg/m}^{3})$:

$$\mathbf{a_{c,\ prac} = \frac{2gT}{\rho\ a_{total} L^{2}}}$$

#### Step 2.5: Percentage Error

Compare the calculated values to assess the accuracy of the experiment:

$$\mathbf{\% E = \left| \frac{a_{c,theo} - a_{c,prac}}{a_{c,theo}} \right| \times 100}$$

---


<script>
MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']]
  },
  svg: {
    fontCache: 'global'
  }
};
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
