// Khan Academy topic-to-video mapping
// Maps common math topics to Khan Academy video URLs and YouTube embed IDs
const KHAN_TOPIC_MAP = {
  // === ARITHMETIC & PRE-ALGEBRA ===
  "addition": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-add-subtract", youtube: "AuX7nPBqDts", title: "Addition and Subtraction" },
  "subtraction": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-add-subtract", youtube: "AuX7nPBqDts", title: "Addition and Subtraction" },
  "multiplication": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-multiply-divide", youtube: "mvOkMYCygps", title: "Multiplication" },
  "division": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-multiply-divide", youtube: "MTzTqvzWzm8", title: "Division" },
  "long division": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-multiply-divide", youtube: null, title: "Long Division" },
  "fractions": { video: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic", youtube: "cLP7INqs3JM", title: "Fractions" },
  "adding fractions": { video: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic", youtube: "52ZlXsFJULI", title: "Adding Fractions" },
  "subtracting fractions": { video: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic", youtube: "52ZlXsFJULI", title: "Subtracting Fractions" },
  "multiplying fractions": { video: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic", youtube: "CTKMK1ZGLuk", title: "Multiplying Fractions" },
  "dividing fractions": { video: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic", youtube: "f3ySpxX9oeM", title: "Dividing Fractions" },
  "mixed numbers": { video: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic", youtube: "1xuf6ZKF1_I", title: "Mixed Numbers" },
  "decimals": { video: "https://www.khanacademy.org/math/arithmetic/arith-decimals", youtube: "BItpeFXC4vA", title: "Decimals" },
  "percentages": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-percents", youtube: "FaDtge_vkbg", title: "Percentages" },
  "percent": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-percents", youtube: "FaDtge_vkbg", title: "Percentages" },
  "ratios": { video: "https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic", youtube: "HpdMJaKaXXc", title: "Ratios" },
  "proportions": { video: "https://www.khanacademy.org/math/cc-seventh-grade-math/cc-7th-ratio-proportion", youtube: null, title: "Proportions" },
  "rates": { video: "https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic", youtube: null, title: "Rates" },
  "unit rates": { video: "https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic", youtube: null, title: "Unit Rates" },
  "order of operations": { video: "https://www.khanacademy.org/math/arithmetic", youtube: null, title: "Order of Operations (PEMDAS)" },
  "pemdas": { video: "https://www.khanacademy.org/math/arithmetic", youtube: null, title: "Order of Operations (PEMDAS)" },
  "factors": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-factors-multiples", youtube: "vcn2ruTOwFo", title: "Factors and Multiples" },
  "multiples": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-factors-multiples", youtube: "vcn2ruTOwFo", title: "Factors and Multiples" },
  "prime numbers": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-factors-multiples", youtube: "mIStB5X4U8M", title: "Prime Numbers" },
  "prime factorization": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-factors-multiples", youtube: "vcn2ruTOwFo", title: "Prime Factorization" },
  "gcf": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-factors-multiples", youtube: "jFd-6EPfnec", title: "Greatest Common Factor" },
  "greatest common factor": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-factors-multiples", youtube: "jFd-6EPfnec", title: "Greatest Common Factor" },
  "lcm": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-factors-multiples", youtube: "znmPfDfsir8", title: "Least Common Multiple" },
  "least common multiple": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-factors-multiples", youtube: "znmPfDfsir8", title: "Least Common Multiple" },
  "integers": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-negative-numbers", youtube: "NQSN00zL5gg", title: "Integers" },
  "negative numbers": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-negative-numbers", youtube: "NQSN00zL5gg", title: "Negative Numbers" },
  "absolute value": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-negative-numbers", youtube: "u6zDpUL5RkU", title: "Absolute Value" },
  "exponents": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-exponents-radicals", youtube: "XZRQhkii0h0", title: "Exponents" },
  "powers": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-exponents-radicals", youtube: "XZRQhkii0h0", title: "Exponents and Powers" },
  "square roots": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-exponents-radicals", youtube: "mbc3_e5lWw0", title: "Square Roots" },
  "scientific notation": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-exponents-radicals", youtube: "i6lfVUp5RW8", title: "Scientific Notation" },

  // === ALGEBRA 1 ===
  "variables": { video: "https://www.khanacademy.org/math/algebra/introduction-to-algebra", youtube: "Tm98lnrlbMA", title: "Variables and Expressions" },
  "expressions": { video: "https://www.khanacademy.org/math/algebra/introduction-to-algebra", youtube: "Tm98lnrlbMA", title: "Algebraic Expressions" },
  "algebraic expressions": { video: "https://www.khanacademy.org/math/algebra/introduction-to-algebra", youtube: "Tm98lnrlbMA", title: "Algebraic Expressions" },
  "equations": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations", youtube: null, title: "Solving Equations" },
  "linear equations": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations", youtube: null, title: "Linear Equations" },
  "solving equations": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations", youtube: null, title: "Solving Equations" },
  "one-step equations": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations", youtube: "KyHvVJWjW6Y", title: "One-Step Equations" },
  "two-step equations": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations", youtube: null, title: "Two-Step Equations" },
  "multi-step equations": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations", youtube: "f15zA0PhSek", title: "Multi-Step Equations" },
  "inequalities": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-inequalities", youtube: "xOxvyeSl0uA", title: "Inequalities" },
  "linear inequalities": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-inequalities", youtube: "xOxvyeSl0uA", title: "Linear Inequalities" },
  "slope": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "R948Tsyq4vA", title: "Slope" },
  "slope-intercept form": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "IL3UCuXrUzE", title: "Slope-Intercept Form" },
  "graphing linear equations": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "2UrcUfBizyw", title: "Graphing Linear Equations" },
  "point-slope form": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "K_OI9LA54AA", title: "Point-Slope Form" },
  "systems of equations": { video: "https://www.khanacademy.org/math/algebra/systems-of-linear-equations", youtube: "nok99JOhcjo", title: "Systems of Equations" },
  "substitution": { video: "https://www.khanacademy.org/math/algebra/systems-of-linear-equations", youtube: "STcsaKuW-24", title: "Substitution Method" },
  "elimination": { video: "https://www.khanacademy.org/math/algebra/systems-of-linear-equations", youtube: "wYrxKGt_bLg", title: "Elimination Method" },
  "polynomials": { video: "https://www.khanacademy.org/math/algebra/introduction-to-polynomial-expressions", youtube: "Vm7H0VTlIco", title: "Polynomials" },
  "adding polynomials": { video: "https://www.khanacademy.org/math/algebra/introduction-to-polynomial-expressions", youtube: "ZgFXL6SEUiI", title: "Adding Polynomials" },
  "multiplying polynomials": { video: "https://www.khanacademy.org/math/algebra/introduction-to-polynomial-expressions", youtube: "u1SAo2GiX8A", title: "Multiplying Polynomials" },
  "factoring": { video: "https://www.khanacademy.org/math/algebra/polynomial-factorization", youtube: "eF6zYNzlZKQ", title: "Factoring Polynomials" },
  "factoring polynomials": { video: "https://www.khanacademy.org/math/algebra/polynomial-factorization", youtube: "eF6zYNzlZKQ", title: "Factoring Polynomials" },
  "quadratic equations": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: null, title: "Quadratic Equations" },
  "quadratics": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: null, title: "Quadratic Equations" },
  "quadratic formula": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: "i7idZfS8t8w", title: "Quadratic Formula" },
  "completing the square": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: "bNQY0z76M5A", title: "Completing the Square" },
  "parabola": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: null, title: "Parabolas" },
  "vertex form": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: null, title: "Vertex Form" },
  "functions": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "kvGsIo1TmsM", title: "Functions" },
  "domain and range": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "U-k5N1WPk4g", title: "Domain and Range" },
  "function notation": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "kvGsIo1TmsM", title: "Function Notation" },
  "radicals": { video: "https://www.khanacademy.org/math/algebra/radical-expressions-and-equations", youtube: "BpBh8gvMifs", title: "Radicals" },
  "radical expressions": { video: "https://www.khanacademy.org/math/algebra/radical-expressions-and-equations", youtube: "BpBh8gvMifs", title: "Radical Expressions" },
  "rational expressions": { video: "https://www.khanacademy.org/math/algebra/rational-expressions", youtube: "gHzLHknEk1M", title: "Rational Expressions" },
  "absolute value equations": { video: "https://www.khanacademy.org/math/algebra/absolute-value-equations-functions", youtube: "u6zDpUL5RkU", title: "Absolute Value Equations" },

  // === GEOMETRY ===
  "geometry": { video: "https://www.khanacademy.org/math/geometry", youtube: "il0EJrY64qE", title: "Geometry Basics" },
  "angles": { video: "https://www.khanacademy.org/math/geometry/hs-geo-angles", youtube: "BTnAlNSgNsY", title: "Angles" },
  "parallel lines": { video: "https://www.khanacademy.org/math/geometry/hs-geo-angles", youtube: "H-E5rlpCVu4", title: "Parallel Lines and Transversals" },
  "triangles": { video: "https://www.khanacademy.org/math/geometry/hs-geo-triangles", youtube: "LrS5_l-gk94", title: "Triangles" },
  "pythagorean theorem": { video: "https://www.khanacademy.org/math/geometry/hs-geo-pythagorean-theorem", youtube: "AA6RfgP-AHU", title: "Pythagorean Theorem" },
  "congruence": { video: "https://www.khanacademy.org/math/geometry/hs-geo-congruence", youtube: "CJrVOf_3dN0", title: "Congruence" },
  "similarity": { video: "https://www.khanacademy.org/math/geometry/hs-geo-similarity", youtube: "e6sh8AXz41E", title: "Similarity" },
  "similar triangles": { video: "https://www.khanacademy.org/math/geometry/hs-geo-similarity", youtube: "e6sh8AXz41E", title: "Similar Triangles" },
  "area": { video: "https://www.khanacademy.org/math/geometry/hs-geo-area-and-perimeter", youtube: "LoaBd-sPzkU", title: "Area" },
  "perimeter": { video: "https://www.khanacademy.org/math/geometry/hs-geo-area-and-perimeter", youtube: "LoaBd-sPzkU", title: "Perimeter" },
  "volume": { video: "https://www.khanacademy.org/math/geometry/hs-geo-solids", youtube: null, title: "Volume" },
  "surface area": { video: "https://www.khanacademy.org/math/geometry/hs-geo-solids", youtube: null, title: "Surface Area" },
  "circles": { video: "https://www.khanacademy.org/math/geometry/hs-geo-circles", youtube: "yWGeFDXgQvg", title: "Circles" },
  "circumference": { video: "https://www.khanacademy.org/math/geometry/hs-geo-circles", youtube: "yWGeFDXgQvg", title: "Circumference" },
  "transformations": { video: "https://www.khanacademy.org/math/geometry/hs-geo-transformations", youtube: "XiAoUDfrar0", title: "Transformations" },
  "reflections": { video: "https://www.khanacademy.org/math/geometry/hs-geo-transformations", youtube: "vAlazPPFlyY", title: "Reflections" },
  "rotations": { video: "https://www.khanacademy.org/math/geometry/hs-geo-transformations", youtube: "P35LyN9g0oI", title: "Rotations" },
  "translations": { video: "https://www.khanacademy.org/math/geometry/hs-geo-transformations", youtube: "XiAoUDfrar0", title: "Translations" },
  "coordinate geometry": { video: "https://www.khanacademy.org/math/geometry/hs-geo-analytic-geometry", youtube: "vAlazPPFlyY", title: "Coordinate Geometry" },
  "midpoint": { video: "https://www.khanacademy.org/math/geometry/hs-geo-analytic-geometry", youtube: "Ez_-RwV9WVo", title: "Midpoint Formula" },
  "distance formula": { video: "https://www.khanacademy.org/math/geometry/hs-geo-analytic-geometry", youtube: "nyZuite17Pc", title: "Distance Formula" },

  // === ALGEBRA 2 ===
  "complex numbers": { video: "https://www.khanacademy.org/math/algebra2/complex-numbers-a2", youtube: "SP-YJe7Vldo", title: "Complex Numbers" },
  "imaginary numbers": { video: "https://www.khanacademy.org/math/algebra2/complex-numbers-a2", youtube: "SP-YJe7Vldo", title: "Imaginary Numbers" },
  "logarithms": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "Z5myJ8dg_rM", title: "Logarithms" },
  "logarithmic functions": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "Z5myJ8dg_rM", title: "Logarithmic Functions" },
  "exponential functions": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "6WMZ7J0wwMI", title: "Exponential Functions" },
  "exponential growth": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "6WMZ7J0wwMI", title: "Exponential Growth" },
  "exponential decay": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "6WMZ7J0wwMI", title: "Exponential Decay" },
  "polynomial division": { video: "https://www.khanacademy.org/math/algebra2/polynomial-functions", youtube: null, title: "Polynomial Division" },
  "synthetic division": { video: "https://www.khanacademy.org/math/algebra2/polynomial-functions", youtube: "3Ee_huKclEQ", title: "Synthetic Division" },
  "rational functions": { video: "https://www.khanacademy.org/math/algebra2/rational-functions-a2", youtube: "gHzLHknEk1M", title: "Rational Functions" },
  "sequences": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Sequences" },
  "arithmetic sequences": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Arithmetic Sequences" },
  "geometric sequences": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Geometric Sequences" },
  "series": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Series" },
  "matrices": { video: "https://www.khanacademy.org/math/algebra2/matrices-a2", youtube: "0oGJTQCy4cQ", title: "Matrices" },
  "matrix multiplication": { video: "https://www.khanacademy.org/math/algebra2/matrices-a2", youtube: "OMA2Mwo0aZg", title: "Matrix Multiplication" },
  "conic sections": { video: "https://www.khanacademy.org/math/algebra2/conic-sections-a2", youtube: "lvAYFUIEpFI", title: "Conic Sections" },
  "ellipse": { video: "https://www.khanacademy.org/math/algebra2/conic-sections-a2", youtube: "lvAYFUIEpFI", title: "Ellipses" },
  "hyperbola": { video: "https://www.khanacademy.org/math/algebra2/conic-sections-a2", youtube: "pzSyOTkAsY4", title: "Hyperbolas" },

  // === TRIGONOMETRY ===
  "trigonometry": { video: "https://www.khanacademy.org/math/trigonometry", youtube: "F21S9Wpi0y8", title: "Trigonometry" },
  "sine": { video: "https://www.khanacademy.org/math/trigonometry/trig-right-triangles", youtube: "F21S9Wpi0y8", title: "Sine, Cosine, Tangent" },
  "cosine": { video: "https://www.khanacademy.org/math/trigonometry/trig-right-triangles", youtube: "F21S9Wpi0y8", title: "Sine, Cosine, Tangent" },
  "tangent": { video: "https://www.khanacademy.org/math/trigonometry/trig-right-triangles", youtube: "F21S9Wpi0y8", title: "Sine, Cosine, Tangent" },
  "sohcahtoa": { video: "https://www.khanacademy.org/math/trigonometry/trig-right-triangles", youtube: "F21S9Wpi0y8", title: "SOHCAHTOA" },
  "unit circle": { video: "https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func", youtube: "1m9p9iubMLU", title: "Unit Circle" },
  "trig identities": { video: "https://www.khanacademy.org/math/trigonometry/trig-identities-and-examples", youtube: "1m9p9iubMLU", title: "Trig Identities" },
  "law of sines": { video: "https://www.khanacademy.org/math/trigonometry/trig-with-general-triangles", youtube: "VjmFKle7xIw", title: "Law of Sines" },
  "law of cosines": { video: "https://www.khanacademy.org/math/trigonometry/trig-with-general-triangles", youtube: "pGaDcOMdw48", title: "Law of Cosines" },
  "radian": { video: "https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func", youtube: "EnwWxMZVBeg", title: "Radians" },
  "radians": { video: "https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func", youtube: "EnwWxMZVBeg", title: "Radians" },

  // === PRE-CALCULUS ===
  "precalculus": { video: "https://www.khanacademy.org/math/precalculus", youtube: "kvGsIo1TmsM", title: "Precalculus" },
  "limits": { video: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:limits-and-continuity", youtube: "riXcZT2ICjA", title: "Limits" },
  "continuity": { video: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:limits-and-continuity", youtube: "riXcZT2ICjA", title: "Continuity" },
  "vectors": { video: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:vectors", youtube: "br7tS1t2SFE", title: "Vectors" },
  "parametric equations": { video: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:parametric", youtube: "jexMSlSDubM", title: "Parametric Equations" },
  "polar coordinates": { video: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:polar", youtube: "9iqN12hCn10", title: "Polar Coordinates" },

  // === CALCULUS ===
  "calculus": { video: "https://www.khanacademy.org/math/calculus-1", youtube: "EKvHQc3QEow", title: "Calculus" },
  "derivatives": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules", youtube: "ANyVpMS3HL4", title: "Derivatives" },
  "differentiation": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules", youtube: "ANyVpMS3HL4", title: "Differentiation" },
  "chain rule": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-chain-rule-and-other-advanced-topics", youtube: "0T0QrHO56qg", title: "Chain Rule" },
  "product rule": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules", youtube: null, title: "Product Rule" },
  "quotient rule": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules", youtube: "bRZmfc1YFsQ", title: "Quotient Rule" },
  "integrals": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: null, title: "Integrals" },
  "integration": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: null, title: "Integration" },
  "antiderivatives": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: "xRspb-iev-g", title: "Antiderivatives" },
  "definite integrals": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: "0RdI3-8G4Fs", title: "Definite Integrals" },
  "fundamental theorem of calculus": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: "C7ducZoLKgw", title: "Fundamental Theorem of Calculus" },
  "related rates": { video: "https://www.khanacademy.org/math/calculus-1/cs1-analyzing-functions", youtube: null, title: "Related Rates" },
  "optimization": { video: "https://www.khanacademy.org/math/calculus-1/cs1-analyzing-functions", youtube: null, title: "Optimization" },

  // === STATISTICS & PROBABILITY ===
  "statistics": { video: "https://www.khanacademy.org/math/statistics-probability", youtube: "uhxtUt_-GyM", title: "Statistics" },
  "probability": { video: "https://www.khanacademy.org/math/statistics-probability/probability-library", youtube: "uzkc-qNVoOk", title: "Probability" },
  "mean": { video: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data", youtube: "uhxtUt_-GyM", title: "Mean, Median, Mode" },
  "median": { video: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data", youtube: "uhxtUt_-GyM", title: "Mean, Median, Mode" },
  "mode": { video: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data", youtube: "uhxtUt_-GyM", title: "Mean, Median, Mode" },
  "standard deviation": { video: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data", youtube: "HvDqbzu0i0E", title: "Standard Deviation" },
  "normal distribution": { video: "https://www.khanacademy.org/math/statistics-probability/modeling-distributions-of-data", youtube: null, title: "Normal Distribution" },
  "histogram": { video: "https://www.khanacademy.org/math/statistics-probability/displaying-describing-data", youtube: "4eLJGG2Ad30", title: "Histograms" },
  "scatter plot": { video: "https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data", youtube: null, title: "Scatter Plots" },
  "linear regression": { video: "https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data", youtube: null, title: "Linear Regression" },
  "correlation": { video: "https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data", youtube: null, title: "Correlation" },
  "permutations": { video: "https://www.khanacademy.org/math/statistics-probability/counting-permutations-and-combinations", youtube: "XqQTXW7XfYA", title: "Permutations" },
  "combinations": { video: "https://www.khanacademy.org/math/statistics-probability/counting-permutations-and-combinations", youtube: "iKy-d5_erhI", title: "Combinations" },
  "binomial": { video: "https://www.khanacademy.org/math/statistics-probability/random-variables-stats-library", youtube: null, title: "Binomial Distribution" },
  "expected value": { video: "https://www.khanacademy.org/math/statistics-probability/random-variables-stats-library", youtube: "j__Kredt7vY", title: "Expected Value" },
  "z-score": { video: "https://www.khanacademy.org/math/statistics-probability/modeling-distributions-of-data", youtube: "XKCeLA4UsXw", title: "Z-Scores" },
  "hypothesis testing": { video: "https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample", youtube: "-FtlH4svqx4", title: "Hypothesis Testing" },
  "confidence interval": { video: "https://www.khanacademy.org/math/statistics-probability/confidence-intervals-one-sample", youtube: "hlM7zdf7zwU", title: "Confidence Intervals" },

  // === ADDITIONAL ALIASES (Math Academy uses various naming) ===
  "add": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-add-subtract", youtube: "AuX7nPBqDts", title: "Addition" },
  "subtract": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-add-subtract", youtube: "AuX7nPBqDts", title: "Subtraction" },
  "multiply": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-multiply-divide", youtube: "mvOkMYCygps", title: "Multiplication" },
  "divide": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-multiply-divide", youtube: "MTzTqvzWzm8", title: "Division" },
  "fraction operations": { video: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic", youtube: "cLP7INqs3JM", title: "Fraction Operations" },
  "decimal operations": { video: "https://www.khanacademy.org/math/arithmetic/arith-decimals", youtube: "BItpeFXC4vA", title: "Decimal Operations" },
  "place value": { video: "https://www.khanacademy.org/math/arithmetic", youtube: "BItpeFXC4vA", title: "Place Value" },
  "rounding": { video: "https://www.khanacademy.org/math/arithmetic", youtube: "BItpeFXC4vA", title: "Rounding" },
  "number line": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-negative-numbers", youtube: "NQSN00zL5gg", title: "Number Line" },
  "distributive property": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-arith-prop", youtube: "Tm98lnrlbMA", title: "Distributive Property" },
  "commutative property": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-arith-prop", youtube: "Tm98lnrlbMA", title: "Commutative Property" },
  "associative property": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-arith-prop", youtube: "Tm98lnrlbMA", title: "Associative Property" },
  "combining like terms": { video: "https://www.khanacademy.org/math/algebra/introduction-to-algebra", youtube: "Tm98lnrlbMA", title: "Combining Like Terms" },
  "foil": { video: "https://www.khanacademy.org/math/algebra/introduction-to-polynomial-expressions", youtube: "u1SAo2GiX8A", title: "FOIL Method" },
  "foil method": { video: "https://www.khanacademy.org/math/algebra/introduction-to-polynomial-expressions", youtube: "u1SAo2GiX8A", title: "FOIL Method" },
  "difference of squares": { video: "https://www.khanacademy.org/math/algebra/polynomial-factorization", youtube: "eF6zYNzlZKQ", title: "Difference of Squares" },
  "perfect square trinomial": { video: "https://www.khanacademy.org/math/algebra/polynomial-factorization", youtube: "eF6zYNzlZKQ", title: "Perfect Square Trinomials" },
  "word problems": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations", youtube: null, title: "Word Problems" },
  "systems of equations word problems": { video: "https://www.khanacademy.org/math/algebra/systems-of-linear-equations", youtube: "nok99JOhcjo", title: "Systems of Equations" },
  "factoring quadratics": { video: "https://www.khanacademy.org/math/algebra/polynomial-factorization", youtube: "eF6zYNzlZKQ", title: "Factoring Quadratics" },
  "factoring quadratic expressions": { video: "https://www.khanacademy.org/math/algebra/polynomial-factorization", youtube: "eF6zYNzlZKQ", title: "Factoring Quadratics" },
  "rate problems": { video: "https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic", youtube: null, title: "Rate Problems" },
  "direct variation": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "R948Tsyq4vA", title: "Direct Variation" },
  "inverse variation": { video: "https://www.khanacademy.org/math/algebra2/rational-functions-a2", youtube: "gHzLHknEk1M", title: "Inverse Variation" },
  "cube roots": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-exponents-radicals", youtube: "mbc3_e5lWw0", title: "Cube Roots" },
  "nth roots": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-exponents-radicals", youtube: "mbc3_e5lWw0", title: "Nth Roots" },
  "simplifying radicals": { video: "https://www.khanacademy.org/math/algebra/radical-expressions-and-equations", youtube: "BpBh8gvMifs", title: "Simplifying Radicals" },
  "rational exponents": { video: "https://www.khanacademy.org/math/algebra/radical-expressions-and-equations", youtube: "BpBh8gvMifs", title: "Rational Exponents" },
  "graphing": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "2UrcUfBizyw", title: "Graphing" },
  "coordinate plane": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "2UrcUfBizyw", title: "Coordinate Plane" },
  "linear functions": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "2UrcUfBizyw", title: "Linear Functions" },
  "parallel and perpendicular": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "IL3UCuXrUzE", title: "Parallel and Perpendicular Lines" },
  "piecewise functions": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "kvGsIo1TmsM", title: "Piecewise Functions" },
  "inverse functions": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "kvGsIo1TmsM", title: "Inverse Functions" },
  "composition of functions": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "kvGsIo1TmsM", title: "Composition of Functions" },
  "right triangles": { video: "https://www.khanacademy.org/math/geometry/hs-geo-pythagorean-theorem", youtube: "AA6RfgP-AHU", title: "Right Triangles" },
  "special right triangles": { video: "https://www.khanacademy.org/math/geometry/hs-geo-pythagorean-theorem", youtube: "AA6RfgP-AHU", title: "Special Right Triangles" },
  "30-60-90": { video: "https://www.khanacademy.org/math/geometry/hs-geo-pythagorean-theorem", youtube: "AA6RfgP-AHU", title: "30-60-90 Triangles" },
  "45-45-90": { video: "https://www.khanacademy.org/math/geometry/hs-geo-pythagorean-theorem", youtube: "AA6RfgP-AHU", title: "45-45-90 Triangles" },
  "quadrilaterals": { video: "https://www.khanacademy.org/math/geometry/hs-geo-congruence", youtube: "CJrVOf_3dN0", title: "Quadrilaterals" },
  "polygons": { video: "https://www.khanacademy.org/math/geometry/hs-geo-congruence", youtube: "CJrVOf_3dN0", title: "Polygons" },
  "arc length": { video: "https://www.khanacademy.org/math/geometry/hs-geo-circles", youtube: "yWGeFDXgQvg", title: "Arc Length" },
  "sector area": { video: "https://www.khanacademy.org/math/geometry/hs-geo-circles", youtube: "yWGeFDXgQvg", title: "Sector Area" },
  "inscribed angles": { video: "https://www.khanacademy.org/math/geometry/hs-geo-circles", youtube: "yWGeFDXgQvg", title: "Inscribed Angles" },
  "central angles": { video: "https://www.khanacademy.org/math/geometry/hs-geo-circles", youtube: "yWGeFDXgQvg", title: "Central Angles" },
  "dilations": { video: "https://www.khanacademy.org/math/geometry/hs-geo-transformations", youtube: "XiAoUDfrar0", title: "Dilations" },
  "trig functions": { video: "https://www.khanacademy.org/math/trigonometry/trig-right-triangles", youtube: "F21S9Wpi0y8", title: "Trig Functions" },
  "inverse trig": { video: "https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func", youtube: "1m9p9iubMLU", title: "Inverse Trig Functions" },
  "graphing trig functions": { video: "https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func", youtube: "1m9p9iubMLU", title: "Graphing Trig Functions" },
  "amplitude": { video: "https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func", youtube: "1m9p9iubMLU", title: "Amplitude and Period" },
  "period": { video: "https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func", youtube: "1m9p9iubMLU", title: "Period of Trig Functions" },
  "end behavior": { video: "https://www.khanacademy.org/math/algebra2/polynomial-functions", youtube: null, title: "End Behavior" },
  "zeros of polynomials": { video: "https://www.khanacademy.org/math/algebra2/polynomial-functions", youtube: null, title: "Zeros of Polynomials" },
  "remainder theorem": { video: "https://www.khanacademy.org/math/algebra2/polynomial-functions", youtube: "3Ee_huKclEQ", title: "Remainder Theorem" },
  "factor theorem": { video: "https://www.khanacademy.org/math/algebra2/polynomial-functions", youtube: "3Ee_huKclEQ", title: "Factor Theorem" },
  "asymptotes": { video: "https://www.khanacademy.org/math/algebra2/rational-functions-a2", youtube: "gHzLHknEk1M", title: "Asymptotes" },
  "horizontal asymptote": { video: "https://www.khanacademy.org/math/algebra2/rational-functions-a2", youtube: "gHzLHknEk1M", title: "Horizontal Asymptotes" },
  "vertical asymptote": { video: "https://www.khanacademy.org/math/algebra2/rational-functions-a2", youtube: "gHzLHknEk1M", title: "Vertical Asymptotes" },
  "compound interest": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "6WMZ7J0wwMI", title: "Compound Interest" },
  "natural log": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "Z5myJ8dg_rM", title: "Natural Logarithm" },
  "log properties": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "Z5myJ8dg_rM", title: "Logarithm Properties" },
  "change of base": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "Z5myJ8dg_rM", title: "Change of Base Formula" },
  "sigma notation": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Sigma Notation" },
  "summation": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Summation" },
  "arithmetic series": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Arithmetic Series" },
  "geometric series": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Geometric Series" },
  "determinant": { video: "https://www.khanacademy.org/math/algebra2/matrices-a2", youtube: "0oGJTQCy4cQ", title: "Determinants" },
  "matrix inverse": { video: "https://www.khanacademy.org/math/algebra2/matrices-a2", youtube: "0oGJTQCy4cQ", title: "Matrix Inverse" },
  "implicit differentiation": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-chain-rule-and-other-advanced-topics", youtube: "0T0QrHO56qg", title: "Implicit Differentiation" },
  "l'hopital": { video: "https://www.khanacademy.org/math/calculus-1/cs1-analyzing-functions", youtube: "riXcZT2ICjA", title: "L'Hopital's Rule" },
  "mean value theorem": { video: "https://www.khanacademy.org/math/calculus-1/cs1-analyzing-functions", youtube: null, title: "Mean Value Theorem" },
  "riemann sums": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: null, title: "Riemann Sums" },
  "u-substitution": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: null, title: "U-Substitution" },
  "integration by parts": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: null, title: "Integration by Parts" },
  "area between curves": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: "0RdI3-8G4Fs", title: "Area Between Curves" },
  "volumes of revolution": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: "0RdI3-8G4Fs", title: "Volumes of Revolution" },
  "box plot": { video: "https://www.khanacademy.org/math/statistics-probability/displaying-describing-data", youtube: "4eLJGG2Ad30", title: "Box Plots" },
  "box and whisker": { video: "https://www.khanacademy.org/math/statistics-probability/displaying-describing-data", youtube: "4eLJGG2Ad30", title: "Box and Whisker Plots" },
  "stem and leaf": { video: "https://www.khanacademy.org/math/statistics-probability/displaying-describing-data", youtube: "4eLJGG2Ad30", title: "Stem and Leaf Plots" },
  "interquartile range": { video: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data", youtube: "HvDqbzu0i0E", title: "Interquartile Range" },
  "iqr": { video: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data", youtube: "HvDqbzu0i0E", title: "Interquartile Range" },
  "variance": { video: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data", youtube: "HvDqbzu0i0E", title: "Variance" },
  "outliers": { video: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data", youtube: "HvDqbzu0i0E", title: "Outliers" },
  "two way tables": { video: "https://www.khanacademy.org/math/statistics-probability/displaying-describing-data", youtube: "4eLJGG2Ad30", title: "Two-Way Tables" },
  "conditional probability": { video: "https://www.khanacademy.org/math/statistics-probability/probability-library", youtube: "uzkc-qNVoOk", title: "Conditional Probability" },
  "independent events": { video: "https://www.khanacademy.org/math/statistics-probability/probability-library", youtube: "uzkc-qNVoOk", title: "Independent Events" },
  "dependent events": { video: "https://www.khanacademy.org/math/statistics-probability/probability-library", youtube: "uzkc-qNVoOk", title: "Dependent Events" },
  "tree diagrams": { video: "https://www.khanacademy.org/math/statistics-probability/probability-library", youtube: "uzkc-qNVoOk", title: "Tree Diagrams" },
  "sample space": { video: "https://www.khanacademy.org/math/statistics-probability/probability-library", youtube: "uzkc-qNVoOk", title: "Sample Space" },

  // === MATH ACADEMY SPECIFIC TOPIC NAMES ===
  // These match the exact topic names used in Math Academy's curriculum
  "modeling with linear equations": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations", youtube: null, title: "Modeling with Linear Equations" },
  "graphs of linear equations": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "2UrcUfBizyw", title: "Graphs of Linear Equations" },
  "modeling with two-variable linear equations": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "R948Tsyq4vA", title: "Two-Variable Linear Equations" },
  "two-variable linear inequalities": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-inequalities", youtube: "xOxvyeSl0uA", title: "Two-Variable Linear Inequalities" },
  "working with units": { video: "https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic", youtube: null, title: "Working with Units" },
  "direct and inverse variation": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "R948Tsyq4vA", title: "Direct and Inverse Variation" },
  "rational equations": { video: "https://www.khanacademy.org/math/algebra/rational-expressions", youtube: "gHzLHknEk1M", title: "Rational Equations" },
  "absolute value expressions": { video: "https://www.khanacademy.org/math/algebra/absolute-value-equations-functions", youtube: "u6zDpUL5RkU", title: "Absolute Value Expressions" },
  "absolute value functions": { video: "https://www.khanacademy.org/math/algebra/absolute-value-equations-functions", youtube: "u6zDpUL5RkU", title: "Absolute Value Functions" },
  "rules of exponents": { video: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-exponents-radicals", youtube: "XZRQhkii0h0", title: "Rules of Exponents" },
  "exponential expressions": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "6WMZ7J0wwMI", title: "Exponential Expressions" },
  "exponential equations": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "6WMZ7J0wwMI", title: "Exponential Equations" },
  "quadratic functions": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: null, title: "Quadratic Functions" },
  "modeling with quadratic functions": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: null, title: "Modeling with Quadratic Functions" },
  "introduction to sequences": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Introduction to Sequences" },
  "correlation and regression": { video: "https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data", youtube: null, title: "Correlation and Regression" },
  "correlation & regression": { video: "https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data", youtube: null, title: "Correlation & Regression" },
  "nonlinear equations": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: null, title: "Nonlinear Equations" },
  "knowledge point": { video: "https://www.khanacademy.org/math/algebra", youtube: null, title: "Math Concepts" },

  // === EXTENDED MATH ACADEMY LESSON TITLES (added v4.0) ===
  // These match the long-form lesson names Math Academy uses verbatim.
  "adding and subtracting integers": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-negative-numbers", youtube: "NQSN00zL5gg", title: "Adding and Subtracting Integers" },
  "multiplying and dividing integers": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-negative-numbers", youtube: "NQSN00zL5gg", title: "Multiplying and Dividing Integers" },
  "operations with integers": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-negative-numbers", youtube: "NQSN00zL5gg", title: "Operations with Integers" },
  "operations with rational numbers": { video: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic", youtube: "cLP7INqs3JM", title: "Operations with Rational Numbers" },
  "comparing and ordering rational numbers": { video: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic", youtube: "cLP7INqs3JM", title: "Comparing and Ordering Rational Numbers" },
  "equivalent fractions": { video: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic", youtube: "cLP7INqs3JM", title: "Equivalent Fractions" },
  "comparing fractions": { video: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic", youtube: "cLP7INqs3JM", title: "Comparing Fractions" },
  "converting fractions and decimals": { video: "https://www.khanacademy.org/math/arithmetic/arith-decimals", youtube: "BItpeFXC4vA", title: "Converting Fractions and Decimals" },
  "converting between fractions decimals and percents": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-percents", youtube: "FaDtge_vkbg", title: "Converting Fractions, Decimals & Percents" },
  "percent of a number": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-percents", youtube: "FaDtge_vkbg", title: "Percent of a Number" },
  "percent change": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-percents", youtube: "FaDtge_vkbg", title: "Percent Change" },
  "percent increase and decrease": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-percents", youtube: "FaDtge_vkbg", title: "Percent Increase and Decrease" },
  "discounts and markups": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-percents", youtube: "FaDtge_vkbg", title: "Discounts and Markups" },
  "simple interest": { video: "https://www.khanacademy.org/math/arithmetic/arith-review-percents", youtube: "FaDtge_vkbg", title: "Simple Interest" },
  "unit conversion": { video: "https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic", youtube: "HpdMJaKaXXc", title: "Unit Conversion" },
  "dimensional analysis": { video: "https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic", youtube: "HpdMJaKaXXc", title: "Dimensional Analysis" },
  "scaling ratios": { video: "https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic", youtube: "HpdMJaKaXXc", title: "Scaling Ratios" },
  "proportional relationships": { video: "https://www.khanacademy.org/math/cc-seventh-grade-math/cc-7th-ratio-proportion", youtube: null, title: "Proportional Relationships" },
  "constant of proportionality": { video: "https://www.khanacademy.org/math/cc-seventh-grade-math/cc-7th-ratio-proportion", youtube: null, title: "Constant of Proportionality" },
  "evaluating expressions": { video: "https://www.khanacademy.org/math/algebra/introduction-to-algebra", youtube: "Tm98lnrlbMA", title: "Evaluating Expressions" },
  "writing algebraic expressions": { video: "https://www.khanacademy.org/math/algebra/introduction-to-algebra", youtube: "Tm98lnrlbMA", title: "Writing Algebraic Expressions" },
  "translating words into equations": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations", youtube: "KyHvVJWjW6Y", title: "Translating Words into Equations" },
  "solving linear equations in one variable": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations", youtube: "f15zA0PhSek", title: "Solving Linear Equations in One Variable" },
  "equations with variables on both sides": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations", youtube: "f15zA0PhSek", title: "Equations with Variables on Both Sides" },
  "literal equations": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations", youtube: "f15zA0PhSek", title: "Literal Equations" },
  "solving and graphing inequalities": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-inequalities", youtube: "xOxvyeSl0uA", title: "Solving and Graphing Inequalities" },
  "compound inequalities": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-inequalities", youtube: "xOxvyeSl0uA", title: "Compound Inequalities" },
  "absolute value inequalities": { video: "https://www.khanacademy.org/math/algebra/absolute-value-equations-functions", youtube: "u6zDpUL5RkU", title: "Absolute Value Inequalities" },
  "graphing inequalities on a number line": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-inequalities", youtube: "xOxvyeSl0uA", title: "Graphing Inequalities on a Number Line" },
  "graphing two-variable inequalities": { video: "https://www.khanacademy.org/math/algebra/one-variable-linear-inequalities", youtube: "xOxvyeSl0uA", title: "Graphing Two-Variable Inequalities" },
  "systems of linear inequalities": { video: "https://www.khanacademy.org/math/algebra/systems-of-linear-equations", youtube: "nok99JOhcjo", title: "Systems of Linear Inequalities" },
  "graphing systems of equations": { video: "https://www.khanacademy.org/math/algebra/systems-of-linear-equations", youtube: "nok99JOhcjo", title: "Graphing Systems of Equations" },
  "solving systems by substitution": { video: "https://www.khanacademy.org/math/algebra/systems-of-linear-equations", youtube: "STcsaKuW-24", title: "Solving Systems by Substitution" },
  "solving systems by elimination": { video: "https://www.khanacademy.org/math/algebra/systems-of-linear-equations", youtube: "wYrxKGt_bLg", title: "Solving Systems by Elimination" },
  "slope from a graph": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "R948Tsyq4vA", title: "Slope from a Graph" },
  "slope from two points": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "R948Tsyq4vA", title: "Slope from Two Points" },
  "writing equations of lines": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "IL3UCuXrUzE", title: "Writing Equations of Lines" },
  "parallel and perpendicular lines": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "IL3UCuXrUzE", title: "Parallel and Perpendicular Lines" },
  "standard form of a linear equation": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "IL3UCuXrUzE", title: "Standard Form of a Linear Equation" },
  "x-intercept and y-intercept": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "2UrcUfBizyw", title: "X- and Y-Intercepts" },
  "scatter plots and lines of best fit": { video: "https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data", youtube: null, title: "Scatter Plots and Lines of Best Fit" },
  "linear models": { video: "https://www.khanacademy.org/math/algebra/two-var-linear-equations", youtube: "R948Tsyq4vA", title: "Linear Models" },
  "function notation and evaluation": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "kvGsIo1TmsM", title: "Function Notation and Evaluation" },
  "domain and range from a graph": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "U-k5N1WPk4g", title: "Domain and Range from a Graph" },
  "average rate of change": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "kvGsIo1TmsM", title: "Average Rate of Change" },
  "transformations of functions": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "kvGsIo1TmsM", title: "Transformations of Functions" },
  "shifts and stretches": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "kvGsIo1TmsM", title: "Shifts and Stretches of Functions" },
  "even and odd functions": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "kvGsIo1TmsM", title: "Even and Odd Functions" },
  "operations on functions": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "kvGsIo1TmsM", title: "Operations on Functions" },
  "composite functions": { video: "https://www.khanacademy.org/math/algebra/algebra-functions", youtube: "kvGsIo1TmsM", title: "Composite Functions" },
  "adding and subtracting polynomials": { video: "https://www.khanacademy.org/math/algebra/introduction-to-polynomial-expressions", youtube: "ZgFXL6SEUiI", title: "Adding and Subtracting Polynomials" },
  "factoring by grouping": { video: "https://www.khanacademy.org/math/algebra/polynomial-factorization", youtube: "eF6zYNzlZKQ", title: "Factoring by Grouping" },
  "factoring trinomials": { video: "https://www.khanacademy.org/math/algebra/polynomial-factorization", youtube: "eF6zYNzlZKQ", title: "Factoring Trinomials" },
  "factoring difference of squares": { video: "https://www.khanacademy.org/math/algebra/polynomial-factorization", youtube: "eF6zYNzlZKQ", title: "Factoring Difference of Squares" },
  "factoring sum and difference of cubes": { video: "https://www.khanacademy.org/math/algebra/polynomial-factorization", youtube: "eF6zYNzlZKQ", title: "Factoring Sum and Difference of Cubes" },
  "solving quadratic equations by factoring": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: "i7idZfS8t8w", title: "Solving Quadratic Equations by Factoring" },
  "solving quadratics with the quadratic formula": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: "i7idZfS8t8w", title: "Solving with the Quadratic Formula" },
  "solving quadratics by completing the square": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: "bNQY0z76M5A", title: "Completing the Square" },
  "discriminant": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: "i7idZfS8t8w", title: "The Discriminant" },
  "graphing parabolas": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: null, title: "Graphing Parabolas" },
  "vertex form of a quadratic": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: null, title: "Vertex Form of a Quadratic" },
  "axis of symmetry": { video: "https://www.khanacademy.org/math/algebra/quadratics", youtube: null, title: "Axis of Symmetry" },
  "simplifying rational expressions": { video: "https://www.khanacademy.org/math/algebra/rational-expressions", youtube: "gHzLHknEk1M", title: "Simplifying Rational Expressions" },
  "multiplying and dividing rational expressions": { video: "https://www.khanacademy.org/math/algebra/rational-expressions", youtube: "gHzLHknEk1M", title: "Multiplying & Dividing Rational Expressions" },
  "adding and subtracting rational expressions": { video: "https://www.khanacademy.org/math/algebra/rational-expressions", youtube: "gHzLHknEk1M", title: "Adding & Subtracting Rational Expressions" },
  "solving rational equations": { video: "https://www.khanacademy.org/math/algebra/rational-expressions", youtube: "gHzLHknEk1M", title: "Solving Rational Equations" },
  "solving radical equations": { video: "https://www.khanacademy.org/math/algebra/radical-expressions-and-equations", youtube: "BpBh8gvMifs", title: "Solving Radical Equations" },
  "rationalizing the denominator": { video: "https://www.khanacademy.org/math/algebra/radical-expressions-and-equations", youtube: "BpBh8gvMifs", title: "Rationalizing the Denominator" },
  "imaginary unit": { video: "https://www.khanacademy.org/math/algebra2/complex-numbers-a2", youtube: "SP-YJe7Vldo", title: "The Imaginary Unit i" },
  "operations with complex numbers": { video: "https://www.khanacademy.org/math/algebra2/complex-numbers-a2", youtube: "SP-YJe7Vldo", title: "Operations with Complex Numbers" },
  "graphing exponential functions": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "6WMZ7J0wwMI", title: "Graphing Exponential Functions" },
  "exponential growth and decay": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "6WMZ7J0wwMI", title: "Exponential Growth and Decay" },
  "the number e": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "6WMZ7J0wwMI", title: "The Number e" },
  "natural logarithm": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "Z5myJ8dg_rM", title: "Natural Logarithm" },
  "common logarithm": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "Z5myJ8dg_rM", title: "Common Logarithm" },
  "properties of logarithms": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "Z5myJ8dg_rM", title: "Properties of Logarithms" },
  "solving exponential equations": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "6WMZ7J0wwMI", title: "Solving Exponential Equations" },
  "solving logarithmic equations": { video: "https://www.khanacademy.org/math/algebra2/exponential-and-logarithmic-functions", youtube: "Z5myJ8dg_rM", title: "Solving Logarithmic Equations" },
  "polynomial long division": { video: "https://www.khanacademy.org/math/algebra2/polynomial-functions", youtube: null, title: "Polynomial Long Division" },
  "rational root theorem": { video: "https://www.khanacademy.org/math/algebra2/polynomial-functions", youtube: "3Ee_huKclEQ", title: "Rational Root Theorem" },
  "graphing rational functions": { video: "https://www.khanacademy.org/math/algebra2/rational-functions-a2", youtube: "gHzLHknEk1M", title: "Graphing Rational Functions" },
  "explicit and recursive formulas": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Explicit and Recursive Formulas" },
  "binomial theorem": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Binomial Theorem" },
  "pascal's triangle": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Pascal's Triangle" },
  "matrix operations": { video: "https://www.khanacademy.org/math/algebra2/matrices-a2", youtube: "0oGJTQCy4cQ", title: "Matrix Operations" },
  "solving systems with matrices": { video: "https://www.khanacademy.org/math/algebra2/matrices-a2", youtube: "0oGJTQCy4cQ", title: "Solving Systems with Matrices" },
  "right triangle trigonometry": { video: "https://www.khanacademy.org/math/trigonometry/trig-right-triangles", youtube: "F21S9Wpi0y8", title: "Right Triangle Trigonometry" },
  "trig ratios": { video: "https://www.khanacademy.org/math/trigonometry/trig-right-triangles", youtube: "F21S9Wpi0y8", title: "Trigonometric Ratios" },
  "reciprocal trig functions": { video: "https://www.khanacademy.org/math/trigonometry/trig-right-triangles", youtube: "F21S9Wpi0y8", title: "Reciprocal Trig Functions" },
  "secant cosecant cotangent": { video: "https://www.khanacademy.org/math/trigonometry/trig-right-triangles", youtube: "F21S9Wpi0y8", title: "Sec, Csc, Cot" },
  "angles of elevation and depression": { video: "https://www.khanacademy.org/math/trigonometry/trig-right-triangles", youtube: "F21S9Wpi0y8", title: "Angles of Elevation and Depression" },
  "converting between degrees and radians": { video: "https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func", youtube: "EnwWxMZVBeg", title: "Converting Degrees and Radians" },
  "reference angles": { video: "https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func", youtube: "1m9p9iubMLU", title: "Reference Angles" },
  "graphing sine and cosine": { video: "https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func", youtube: "1m9p9iubMLU", title: "Graphing Sine and Cosine" },
  "graphing tangent": { video: "https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func", youtube: "1m9p9iubMLU", title: "Graphing Tangent" },
  "amplitude period and phase shift": { video: "https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func", youtube: "1m9p9iubMLU", title: "Amplitude, Period, and Phase Shift" },
  "pythagorean identity": { video: "https://www.khanacademy.org/math/trigonometry/trig-identities-and-examples", youtube: "1m9p9iubMLU", title: "Pythagorean Identity" },
  "sum and difference identities": { video: "https://www.khanacademy.org/math/trigonometry/trig-identities-and-examples", youtube: "1m9p9iubMLU", title: "Sum and Difference Identities" },
  "double angle formulas": { video: "https://www.khanacademy.org/math/trigonometry/trig-identities-and-examples", youtube: "1m9p9iubMLU", title: "Double Angle Formulas" },
  "half angle formulas": { video: "https://www.khanacademy.org/math/trigonometry/trig-identities-and-examples", youtube: "1m9p9iubMLU", title: "Half Angle Formulas" },
  "verifying trig identities": { video: "https://www.khanacademy.org/math/trigonometry/trig-identities-and-examples", youtube: "1m9p9iubMLU", title: "Verifying Trig Identities" },
  "solving trig equations": { video: "https://www.khanacademy.org/math/trigonometry/trig-equations-and-identities", youtube: "1m9p9iubMLU", title: "Solving Trigonometric Equations" },
  "law of sines and cosines": { video: "https://www.khanacademy.org/math/trigonometry/trig-with-general-triangles", youtube: "VjmFKle7xIw", title: "Laws of Sines and Cosines" },
  "polar form": { video: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:polar", youtube: "9iqN12hCn10", title: "Polar Form" },
  "converting polar and rectangular": { video: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:polar", youtube: "9iqN12hCn10", title: "Converting Polar and Rectangular Coordinates" },
  "vectors operations": { video: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:vectors", youtube: "br7tS1t2SFE", title: "Vector Operations" },
  "dot product": { video: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:vectors", youtube: "br7tS1t2SFE", title: "Dot Product" },
  "cross product": { video: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:vectors", youtube: "br7tS1t2SFE", title: "Cross Product" },
  "limit definition of derivative": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules", youtube: "ANyVpMS3HL4", title: "Limit Definition of the Derivative" },
  "power rule": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules", youtube: "ANyVpMS3HL4", title: "Power Rule" },
  "derivative of trig functions": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules", youtube: "ANyVpMS3HL4", title: "Derivatives of Trig Functions" },
  "derivative of exponential": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules", youtube: "ANyVpMS3HL4", title: "Derivative of e^x" },
  "derivative of log": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules", youtube: "ANyVpMS3HL4", title: "Derivative of ln(x)" },
  "tangent line": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules", youtube: "ANyVpMS3HL4", title: "Tangent Line" },
  "linearization": { video: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules", youtube: "ANyVpMS3HL4", title: "Linearization" },
  "critical points": { video: "https://www.khanacademy.org/math/calculus-1/cs1-analyzing-functions", youtube: null, title: "Critical Points" },
  "first derivative test": { video: "https://www.khanacademy.org/math/calculus-1/cs1-analyzing-functions", youtube: null, title: "First Derivative Test" },
  "second derivative test": { video: "https://www.khanacademy.org/math/calculus-1/cs1-analyzing-functions", youtube: null, title: "Second Derivative Test" },
  "concavity": { video: "https://www.khanacademy.org/math/calculus-1/cs1-analyzing-functions", youtube: null, title: "Concavity" },
  "inflection points": { video: "https://www.khanacademy.org/math/calculus-1/cs1-analyzing-functions", youtube: null, title: "Inflection Points" },
  "fundamental theorem": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: "C7ducZoLKgw", title: "Fundamental Theorem of Calculus" },
  "trapezoidal rule": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: null, title: "Trapezoidal Rule" },
  "u substitution": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: null, title: "U-Substitution" },
  "improper integrals": { video: "https://www.khanacademy.org/math/calculus-1/cs1-integrals", youtube: null, title: "Improper Integrals" },
  "convergence tests": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Convergence Tests" },
  "taylor series": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Taylor Series" },
  "maclaurin series": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Maclaurin Series" },
  "power series": { video: "https://www.khanacademy.org/math/algebra2/sequences-and-series-a2", youtube: "KRFiAlo7t1E", title: "Power Series" },
  "triangle congruence": { video: "https://www.khanacademy.org/math/geometry/hs-geo-congruence", youtube: "CJrVOf_3dN0", title: "Triangle Congruence" },
  "sas asa sss": { video: "https://www.khanacademy.org/math/geometry/hs-geo-congruence", youtube: "CJrVOf_3dN0", title: "SAS, ASA, SSS" },
  "triangle similarity": { video: "https://www.khanacademy.org/math/geometry/hs-geo-similarity", youtube: "e6sh8AXz41E", title: "Triangle Similarity" },
  "triangle inequality": { video: "https://www.khanacademy.org/math/geometry/hs-geo-triangles", youtube: "LrS5_l-gk94", title: "Triangle Inequality" },
  "interior and exterior angles": { video: "https://www.khanacademy.org/math/geometry/hs-geo-angles", youtube: "BTnAlNSgNsY", title: "Interior and Exterior Angles" },
  "angle relationships": { video: "https://www.khanacademy.org/math/geometry/hs-geo-angles", youtube: "BTnAlNSgNsY", title: "Angle Relationships" },
  "parallelograms": { video: "https://www.khanacademy.org/math/geometry/hs-geo-congruence", youtube: "CJrVOf_3dN0", title: "Parallelograms" },
  "rectangles rhombuses squares": { video: "https://www.khanacademy.org/math/geometry/hs-geo-congruence", youtube: "CJrVOf_3dN0", title: "Rectangles, Rhombuses, Squares" },
  "trapezoids": { video: "https://www.khanacademy.org/math/geometry/hs-geo-congruence", youtube: "CJrVOf_3dN0", title: "Trapezoids" },
  "geometric proofs": { video: "https://www.khanacademy.org/math/geometry/hs-geo-congruence", youtube: "CJrVOf_3dN0", title: "Geometric Proofs" },
  "two column proofs": { video: "https://www.khanacademy.org/math/geometry/hs-geo-congruence", youtube: "CJrVOf_3dN0", title: "Two-Column Proofs" },
  "circle theorems": { video: "https://www.khanacademy.org/math/geometry/hs-geo-circles", youtube: "yWGeFDXgQvg", title: "Circle Theorems" },
  "tangent lines and circles": { video: "https://www.khanacademy.org/math/geometry/hs-geo-circles", youtube: "yWGeFDXgQvg", title: "Tangent Lines to Circles" },
  "equation of a circle": { video: "https://www.khanacademy.org/math/geometry/hs-geo-analytic-geometry", youtube: "Ez_-RwV9WVo", title: "Equation of a Circle" },
  "volume of prisms and cylinders": { video: "https://www.khanacademy.org/math/geometry/hs-geo-solids", youtube: null, title: "Volume of Prisms and Cylinders" },
  "volume of cones and pyramids": { video: "https://www.khanacademy.org/math/geometry/hs-geo-solids", youtube: null, title: "Volume of Cones and Pyramids" },
  "volume of spheres": { video: "https://www.khanacademy.org/math/geometry/hs-geo-solids", youtube: null, title: "Volume of Spheres" },
  "data displays": { video: "https://www.khanacademy.org/math/statistics-probability/displaying-describing-data", youtube: "4eLJGG2Ad30", title: "Data Displays" },
  "five number summary": { video: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data", youtube: "HvDqbzu0i0E", title: "Five-Number Summary" },
  "measures of central tendency": { video: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data", youtube: "uhxtUt_-GyM", title: "Measures of Central Tendency" },
  "measures of spread": { video: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data", youtube: "HvDqbzu0i0E", title: "Measures of Spread" },
  "correlation coefficient": { video: "https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data", youtube: null, title: "Correlation Coefficient" },
  "least squares regression": { video: "https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data", youtube: null, title: "Least Squares Regression" },
  "residual plots": { video: "https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data", youtube: null, title: "Residual Plots" },
  "sampling methods": { video: "https://www.khanacademy.org/math/statistics-probability/displaying-describing-data", youtube: null, title: "Sampling Methods" },
  "experimental design": { video: "https://www.khanacademy.org/math/statistics-probability/displaying-describing-data", youtube: null, title: "Experimental Design" },
  "central limit theorem": { video: "https://www.khanacademy.org/math/statistics-probability/sampling-distributions-library", youtube: null, title: "Central Limit Theorem" },
  "sampling distributions": { video: "https://www.khanacademy.org/math/statistics-probability/sampling-distributions-library", youtube: null, title: "Sampling Distributions" },
  "p-value": { video: "https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample", youtube: "-FtlH4svqx4", title: "P-values" },
  "t-test": { video: "https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample", youtube: "-FtlH4svqx4", title: "T-Tests" },
  "chi square": { video: "https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample", youtube: "-FtlH4svqx4", title: "Chi-Squared Tests" },
  "type i and type ii errors": { video: "https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample", youtube: "-FtlH4svqx4", title: "Type I and Type II Errors" },
};

// Fuzzy matching function to find the best topic match
function findBestTopicMatch(searchTerm) {
  const normalized = searchTerm.toLowerCase().trim();

  // Remove common filler words
  const stripped = normalized
    .replace(/\b(introduction to|intro to|basics of|basic|understanding|review of|the|an?|of|in|for|with|and)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Direct match
  if (KHAN_TOPIC_MAP[normalized]) return KHAN_TOPIC_MAP[normalized];
  if (KHAN_TOPIC_MAP[stripped]) return KHAN_TOPIC_MAP[stripped];

  // 2. Search contains a map key — prefer the LONGEST key contained in the search.
  //    This is safe: if a student is on "Solving Linear Equations in One Variable",
  //    it will match the longest key ("linear equations") contained in that phrase.
  const sortedKeys = Object.keys(KHAN_TOPIC_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (stripped.includes(key) || normalized.includes(key)) {
      return KHAN_TOPIC_MAP[key];
    }
  }

  // 3. Word-level scoring — pick the key with the strongest token overlap.
  //    We deliberately avoid the reverse "key.includes(stripped)" shortcut because
  //    a short generic search (e.g. "equations") would otherwise latch onto the
  //    longest key that happens to contain that word, which is almost always wrong.
  const searchWords = stripped.split(/\s+/).filter(w => w.length > 1);
  if (searchWords.length === 0) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const [key, value] of Object.entries(KHAN_TOPIC_MAP)) {
    const keyWords = key.split(/\s+/);
    let score = 0;
    let keyWordsMatched = 0;
    let searchWordsMatched = 0;
    const matchedSearchWords = new Set();

    for (const kw of keyWords) {
      let matchedThis = false;
      for (const sw of searchWords) {
        if (sw === kw) {
          score += 3;
          matchedThis = true;
          matchedSearchWords.add(sw);
        } else if (sw.length > 3 && kw.length > 3 && (sw.includes(kw) || kw.includes(sw))) {
          score += 1;
          matchedThis = true;
          matchedSearchWords.add(sw);
        }
      }
      if (matchedThis) keyWordsMatched++;
    }
    searchWordsMatched = matchedSearchWords.size;

    if (score === 0) continue;

    // Coverage bonuses — prefer keys where most words on BOTH sides line up.
    const keyCoverage = keyWordsMatched / keyWords.length;
    const searchCoverage = searchWordsMatched / searchWords.length;
    score += Math.round(keyCoverage * 5);
    score += Math.round(searchCoverage * 3);

    // Penalty: if the key is way longer than the search, it's probably too specific.
    // (e.g. generic search "equations" vs key "modeling with two-variable linear equations")
    if (keyWords.length > searchWords.length + 2) {
      score -= (keyWords.length - searchWords.length) * 2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = value;
    }
  }

  // Require a minimum match quality so we don't return garbage.
  if (bestScore >= 3) return bestMatch;
  return null;
}

// Find topics related to the given search term — returns up to `count`
// keys from the map, ranked by word overlap, excluding the best match.
function findRelatedTopics(searchTerm, count) {
  count = count || 4;
  const normalized = (searchTerm || '').toLowerCase().trim();
  if (!normalized) return [];
  const stripped = normalized
    .replace(/\b(introduction to|intro to|basics of|basic|understanding|review of|the|an?|of|in|for|with|and)\b/g, ' ')
    .replace(/\s+/g, ' ').trim();
  const searchWords = stripped.split(/\s+/).filter((w) => w.length > 2);
  if (!searchWords.length) return [];

  const scored = [];
  for (const [key, value] of Object.entries(KHAN_TOPIC_MAP)) {
    if (key === normalized || key === stripped) continue;
    if (!value.youtube) continue; // only suggest topics that have a video
    const keyWords = key.split(/\s+/);
    let score = 0;
    let hits = 0;
    for (const sw of searchWords) {
      for (const kw of keyWords) {
        if (sw === kw) { score += 5; hits++; break; }
        if (sw.length > 3 && kw.length > 3 && (sw.includes(kw) || kw.includes(sw))) { score += 2; hits++; break; }
      }
    }
    if (!hits) continue;
    // prefer concise keys (less specific phrasing tends to be more parent-y)
    score -= Math.max(0, keyWords.length - searchWords.length) * 0.5;
    scored.push({ key, value, score });
  }
  scored.sort((a, b) => b.score - a.score);
  // dedupe by youtube id so we don't show 5 chips that all play the same video
  const seen = new Set();
  const out = [];
  for (const s of scored) {
    if (seen.has(s.value.youtube)) continue;
    seen.add(s.value.youtube);
    out.push({ topic: s.key, title: s.value.title, youtube: s.value.youtube });
    if (out.length >= count) break;
  }
  return out;
}

// Make available to other scripts
if (typeof module !== 'undefined') {
  module.exports = { KHAN_TOPIC_MAP, findBestTopicMatch, findRelatedTopics };
}
