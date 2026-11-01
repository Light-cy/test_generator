import { QuestionType, Question } from './types';

export const QUESTION_BANK: Record<string, {
  mcqs?: Array<{ text: string; options: string[]; correctOption: string; urduText?: string }>;
  shortQuestions?: Array<{ text: string; urduText?: string }>;
  longQuestions?: Array<{ text: string; urduText?: string }>;
  numericals?: Array<{ text: string }>;
}> = {
  // ================= 9TH PHYSICS =================
  '9th Class|Physics|Ch 1: Physical Quantities and Measurement': {
    mcqs: [
      { text: "Number of base units in SI are:", options: ["3", "6", "7", "9"], correctOption: "7", urduText: "ایس آئی میں بنیادی یونٹس کی تعداد ہے:" },
      { text: "Which of the following is a derived unit?", options: ["Pascal", "Kilogram", "Newton", "Candela"], correctOption: "Newton", urduText: "مندرجہ ذیل میں سے ماخوذ یونٹ کونسا ہے؟" },
      { text: "One micrometer is equal to:", options: ["10^-3 m", "10^-6 m", "10^-9 m", "10^6 m"], correctOption: "10^-6 m", urduText: "ایک مائیکرو میٹر برابر ہے:" },
      { text: "Least count of Vernier Callipers is:", options: ["0.1 cm", "0.01 cm", "0.1 mm", "0.01 mm"], correctOption: "0.01 cm", urduText: "ورنیئر کیلیپرز کا لیسٹ کاؤنٹ ہوتا ہے:" },
      { text: "Significant figures in 0.00580 are:", options: ["2", "3", "4", "5"], correctOption: "3", urduText: "0.00580 میں اہم ہندسوں کی تعداد ہے:" },
      { text: "An interval of 200 microseconds is equivalent to:", options: ["0.2 s", "0.02 s", "2 x 10^-4 s", "2 x 10^-6 s"], correctOption: "2 x 10^-4 s", urduText: "200 مائیکرو سیکنڈز کا وقفہ برابر ہے:" }
    ],
    shortQuestions: [
      { text: "Define Physics and name any four branches of Physics.", urduText: "فزکس کی تعریف کریں اور اس کی کوئی سی چار شاخوں کے نام لکھیں۔" },
      { text: "Differentiate between base quantities and derived quantities with examples.", urduText: "بنیادی اور ماخوذ مقداروں میں مثالوں سے فرق واضح کریں۔" },
      { text: "What is meant by Scientific Notation (Standard Form)? Give two examples.", urduText: "سائنسی نوٹیشن سے کیا مراد ہے؟ دو مثالیں دیجیے۔" },
      { text: "What is Zero Error and Zero Correction in Vernier Callipers?", urduText: "ورنیئر کیلیپرز میں زیرو ایرر اور زیرو کریکشن کیا ہے؟" },
      { text: "What are the rules for determining significant figures in a measurement?", urduText: "پیمائش میں اہم ہندسوں کے تعین کے اصول بیان کریں۔" },
      { text: "Why is Screw Gauge more precise than Vernier Callipers?", urduText: "سکرو گیج ورنیئر کیلیپرز سے زیادہ درست پیمائش کیوں دیتا ہے؟" }
    ],
    longQuestions: [
      { text: "What are prefixes? Explain multiples and submultiples of SI units with a detailed table and examples.", urduText: "پریفکسز سے کیا مراد ہے؟ ایس آئی یونٹس کے ملٹیپلز اور سب ملٹیپلز کو تفصیلاً بیان کریں۔" },
      { text: "Describe the construction and working of a Screw Gauge with pitch and least count derivation.", urduText: "سکرو گیج کی بناوٹ اور طریقہ کار اس کی پچ اور لیسٹ کاؤنٹ کے ساتھ تفصیلاً بیان کریں۔" }
    ],
    numericals: [
      { text: "1.1: Express following quantities using prefixes: (a) 5000 g (b) 2000000 W (c) 52 x 10^-10 kg (d) 225 x 10^-8 s." },
      { text: "1.2: How do the prefixes micro, nano and pico relate to each other?" },
      { text: "1.3: Your hair grows at the rate of 1 mm per day. Find their growth rate in nm/s." },
      { text: "1.5: Write in standard form: (a) 6400 km (b) 380,000 km (c) 300,000,000 m/s (d) seconds in a day." }
    ]
  },
  '9th Class|Physics|Ch 2: Kinematics': {
    mcqs: [
      { text: "A body has translatory motion if it moves along a:", options: ["Straight line only", "Circle only", "Line without rotation", "Curved path only"], correctOption: "Line without rotation", urduText: "کوئی جسم ٹرانسلیٹری موشن میں ہوتا ہے اگر وہ حرکت کرے:" },
      { text: "Rate of change of displacement is known as:", options: ["Speed", "Velocity", "Acceleration", "Distance"], correctOption: "Velocity", urduText: "ڈسپلیسمنٹ میں تبدیلی کی شرح کو کہتے ہیں:" },
      { text: "The motion of a freely falling body is an example of:", options: ["Uniform velocity", "Uniform acceleration", "Variable acceleration", "Zero acceleration"], correctOption: "Uniform acceleration", urduText: "گرتے ہوئے جسم کی حرکت مثال ہے:" },
      { text: "Distance-time graph for a body moving with constant speed is a:", options: ["Curved line", "Straight line inclined to time axis", "Horizontal line", "Vertical line"], correctOption: "Straight line inclined to time axis", urduText: "مستقل سپیڈ سے حرکت کرتے ہوئے جسم کا فاصلہ-وقت گراف ہوتا ہے:" }
    ],
    shortQuestions: [
      { text: "Differentiate between Rest and Motion with respect to an observer.", urduText: "مشاہدہ کرنے والے کے لحاظ سے ریسٹ اور موشن میں فرق بیان کریں۔" },
      { text: "Differentiate between Scalar and Vector quantities with two examples each.", urduText: "سکیلر اور ویکٹر مقداروں میں دو دو مثالوں سے فرق بیان کریں۔" },
      { text: "Define Uniform Acceleration and write its SI unit.", urduText: "یونیفارم ایکسلریشن کی تعریف کریں اور اس کا ایس آئی یونٹ لکھیں۔" },
      { text: "Can a body moving at constant speed have acceleration? Explain briefly.", urduText: "کیا مستقل سپیڈ سے حرکت کرنے والے جسم میں ایکسلریشن ہو سکتا ہے؟ مختصر وضاحت کریں۔" }
    ],
    longQuestions: [
      { text: "Derive the second equation of motion (S = vi*t + 0.5*a*t^2) with the help of a speed-time graph.", urduText: "سپیڈ-وقت گراف کی مدد سے حرکت کی دوسری مساوات اخذ کریں۔" },
      { text: "Derive the third equation of motion (2aS = vf^2 - vi^2) using a speed-time graph.", urduText: "حرکت کی تیسری مساوات گراف کی مدد سے ثابت کریں۔" }
    ],
    numericals: [
      { text: "2.1: A train moves with a uniform velocity of 36 km/h for 10 s. Find the distance traveled by it." },
      { text: "2.2: A train starts from rest. It moves through 1 km in 100 s with uniform acceleration. What will be its speed at the end of 100 s?" },
      { text: "2.3: A car has a velocity of 10 m/s. It accelerates at 0.2 m/s^2 for half a minute. Find the distance traveled during this time." }
    ]
  },

  // ================= 9TH CHEMISTRY =================
  '9th Class|Chemistry|Ch 1: Fundamentals of Chemistry': {
    mcqs: [
      { text: "The mass of one mole of a substance is called its:", options: ["Atomic mass", "Molecular mass", "Molar mass", "Formula mass"], correctOption: "Molar mass", urduText: "کسی شے کے ایک مول کا ماس کہلاتا ہے:" },
      { text: "Which of the following is a triatomic molecule?", options: ["H2", "O2", "H2O", "CH4"], correctOption: "H2O", urduText: "مندرجہ ذیل میں سے سہ ایٹمی مالیکیول کونسا ہے؟" },
      { text: "Empirical formula of hydrogen peroxide (H2O2) is:", options: ["H2O", "HO", "H2O2", "OH2"], correctOption: "HO", urduText: "ہائیڈروجن پرآکسائیڈ کا ایمپیریکل فارمولا ہے:" },
      { text: "The number of particles in one mole of any substance is:", options: ["6.02 x 10^23", "6.02 x 10^22", "6.02 x 10^24", "1.66 x 10^-24"], correctOption: "6.02 x 10^23", urduText: "کسی شے کے ایک مول میں پارٹیکلز کی تعداد ہوتی ہے:" }
    ],
    shortQuestions: [
      { text: "Define Valency and describe how the valency of variable elements is represented.", urduText: "ویلینسی کی تعریف کریں اور متغیر ویلینسی کو کیسے ظاہر کیا جاتا ہے؟" },
      { text: "Differentiate between Compound and Mixture with three points.", urduText: "کمپاؤنڈ اور مکسچر میں تین بنیادی فرق تحریر کریں۔" },
      { text: "Differentiate between Empirical Formula and Molecular Formula with examples.", urduText: "ایمپیریکل فارمولا اور مالیکیولر فارمولا میں فرق مثالوں سے واضح کریں۔" },
      { text: "What is Avogadro's Number? What is its significance in chemistry?", urduText: "ایووگیڈرو نمبر کیا ہے اور کیمسٹری میں اس کی کیا اہمیت ہے؟" }
    ],
    longQuestions: [
      { text: "Define Chemistry and explain its any five branches in detail.", urduText: "کیمسٹری کی تعریف کریں اور اس کی پانچ اہم شاخوں کی تفصیل بیان کریں۔" },
      { text: "Differentiate in detail between Atom and Ion, and Molecule and Molecular Ion.", urduText: "ایٹم اور آئن نیز مالیکیول اور مالیکیولر آئن میں تفصیلی فرق بیان کریں۔" }
    ],
    numericals: [
      { text: "Calculate the number of moles and molecules in 9.0 g of water (H2O)." },
      { text: "Calculate the molar mass of: (a) H2SO4 (b) C6H12O6 (c) CaCO3." }
    ]
  },

  // ================= 9TH COMPUTER SCIENCE =================
  '9th Class|Computer Science|Ch 1: Problem Solving (Flowcharts & Algorithms)': {
    mcqs: [
      { text: "A step-by-step procedure to solve a problem in natural language is called:", options: ["Flowchart", "Algorithm", "Source code", "Pseudocode"], correctOption: "Algorithm" },
      { text: "Which flowchart symbol is used for decision making / branching?", options: ["Rectangle", "Parallelogram", "Diamond", "Oval"], correctOption: "Diamond" },
      { text: "The oval shape in a flowchart represents:", options: ["Input/Output", "Process", "Start/End (Terminal)", "Connector"], correctOption: "Start/End (Terminal)" },
      { text: "Testing the algorithm using test data and trace table is called:", options: ["Debugging", "Desk Checking", "Verification", "Validation"], correctOption: "Desk Checking" }
    ],
    shortQuestions: [
      { text: "Define Problem Solving and list the five steps involved in problem solving." },
      { text: "What is a Flowchart? State any two advantages of using flowcharts." },
      { text: "Differentiate between Algorithm and Flowchart." },
      { text: "What is meant by Trace Table? Why is it prepared?" },
      { text: "Differentiate between Verification and Validation of an algorithm." }
    ],
    longQuestions: [
      { text: "Explain the importance of Flowcharts in problem solving. Draw and explain any six standard flowchart symbols with their shapes and functions." },
      { text: "What is an Algorithm? Write an algorithm to find the largest among three numbers and explain step-by-step efficiency analysis." }
    ]
  },

  // ================= 9TH MATHEMATICS =================
  '9th Class|Mathematics|Ch 1: Matrices and Determinants': {
    mcqs: [
      { text: "The order of matrix [2  1] is:", options: ["2-by-1", "1-by-2", "1-by-1", "2-by-2"], correctOption: "1-by-2" },
      { text: "Which of the following is a scalar matrix?", options: ["[2 0; 0 2]", "[1 0; 0 1]", "[2 0; 0 3]", "[0 0; 0 0]"], correctOption: "[2 0; 0 2]" },
      { text: "If |A| = 0, then matrix A is called a:", options: ["Singular matrix", "Non-singular matrix", "Symmetric matrix", "Identity matrix"], correctOption: "Singular matrix" },
      { text: "Adjoint of [a b; c d] is:", options: ["[d -b; -c a]", "[d b; c a]", "[-d -b; -c -a]", "[a -c; -b d]"], correctOption: "[d -b; -c a]" }
    ],
    shortQuestions: [
      { text: "Define Equal Matrices and state the two necessary conditions." },
      { text: "Find the transpose of matrix A = [1 2 3; 2 -1 4; 3 4 0]." },
      { text: "Differentiate between Symmetric and Skew-Symmetric matrices with examples." },
      { text: "If A = [2 3; 1 5], find the determinant of matrix A." },
      { text: "Find the multiplicative inverse of matrix M = [-1 3; 2 0] if it exists." }
    ],
    longQuestions: [
      { text: "Solve the following system of linear equations using Cramer’s Rule: 2x - 2y = 4 and 3x + 2y = 6." },
      { text: "Solve the linear system by Matrix Inversion Method: 4x + y = 9 and -3x - y = -5." }
    ]
  },

  // ================= 10TH PHYSICS =================
  '10th Class|Physics|Ch 10: Simple Harmonic Motion and Waves': {
    mcqs: [
      { text: "Which of the following is an example of Simple Harmonic Motion?", options: ["Motion of a simple pendulum", "Motion of ceiling fan", "Spinning of Earth", "Bouncing ball"], correctOption: "Motion of a simple pendulum", urduText: "مندرجہ ذیل میں سے سادہ ہارمونک موشن کی مثال ہے:" },
      { text: "If the length of a simple pendulum is quadrupled, its time period will:", options: ["Double", "Halve", "Four times", "Remain same"], correctOption: "Double", urduText: "اگر پینڈولم کی لمبائی چار گنا کر دی جائے تو اس کا ٹائم پیریڈ:" },
      { text: "The relation between velocity, frequency, and wavelength of a wave is:", options: ["v = f * lambda", "f = v * lambda", "v = f / lambda", "lambda = v * f"], correctOption: "v = f * lambda", urduText: "ویو کی ویلوسٹی، فریکوئنسی اور ویولینتھ میں تعلق ہے:" }
    ],
    shortQuestions: [
      { text: "State Hooke's Law for a mass attached to a spring and write its formula.", urduText: "سپرنگ سے بندھے ماس کے لیے ہک کا قانون بیان کریں اور فارمولا لکھیں۔" },
      { text: "Define Simple Harmonic Motion (SHM) and state its two main characteristics.", urduText: "سادہ ہارمونک موشن کی تعریف کریں اور اس کی دو اہم خصوصیات لکھیں۔" },
      { text: "Differentiate between Longitudinal Waves and Transverse Waves with diagrams.", urduText: "لونگیٹیوڈنل اور ٹرانسورس ویوز میں اشکال کے ساتھ فرق واضح کریں۔" },
      { text: "What is meant by Damped Oscillations? Give one practical application.", urduText: "ڈیمپڈ آسیلیشنز سے کیا مراد ہے؟ اس کا ایک عملی اطلاق بیان کریں۔" }
    ],
    longQuestions: [
      { text: "Prove that the motion of a simple pendulum is Simple Harmonic Motion (SHM). Derive the formula for its time period.", urduText: "ثابت کریں کہ سادہ پینڈولم کی موشن ایس ایچ ایم ہے۔ اس کے ٹائم پیریڈ کا فارمولا اخذ کریں۔" },
      { text: "What is a Ripple Tank? Explain reflection, refraction, and diffraction of water waves with diagrams.", urduText: "رپل ٹینک کیا ہے؟ پانی کی لہروں کے ریفلیکشن، ریفریکشن اور ڈفریکشن کی وضاحت کریں۔" }
    ],
    numericals: [
      { text: "10.1: The time period of a simple pendulum is 2 s. What will be its length on Earth and on the Moon? (ge = 10 m/s^2, gm = ge / 6)." },
      { text: "10.2: A pendulum of length 0.99 m is taken to the Moon by an astronaut. The period of the pendulum is 4.9 s. What is the value of g on the Moon?" },
      { text: "10.5: If 100 waves pass through a medium in 20 s, find frequency, time period, and wavelength if wave speed is 20 m/s." }
    ]
  },

  // ================= 11TH PHYSICS =================
  '11th Class|Physics|Ch 1: Measurements': {
    mcqs: [
      { text: "The SI unit of solid angle is:", options: ["Radian", "Steradian", "Degree", "Revolution"], correctOption: "Steradian" },
      { text: "The dimensions of work are equivalent to dimensions of:", options: ["Force", "Torque", "Power", "Momentum"], correctOption: "Torque" },
      { text: "A precise measurement is one which has:", options: ["Less absolute uncertainty", "Less fractional uncertainty", "Less percentage uncertainty", "Greater accuracy"], correctOption: "Less absolute uncertainty" }
    ],
    shortQuestions: [
      { text: "Distinguish between Precision and Accuracy with examples." },
      { text: "What is the difference between Radian and Steradian supplementary units?" },
      { text: "Check the correctness of the relation v = sqrt(F * l / m) using dimensional analysis." }
    ],
    longQuestions: [
      { text: "Define dimensions of physical quantities. State the principle of homogeneity and show that s = vi*t + 0.5*a*t^2 is dimensionally correct." }
    ],
    numericals: [
      { text: "1.1: A light year is the distance light travels in one year. How many meters are there in one light year? (Speed of light = 3.0 x 10^8 m/s)." },
      { text: "1.2: Find the area of a rectangular plate having length (1.53 ± 0.01) m and width (1.28 ± 0.01) m with percentage uncertainty." }
    ]
  },

  // ================= 12TH PHYSICS =================
  '12th Class|Physics|Ch 12: Electrostatics': {
    mcqs: [
      { text: "The SI unit of electric flux is:", options: ["N m^2 C^-1", "N C^-1", "N m C^-1", "V / m"], correctOption: "N m^2 C^-1" },
      { text: "The electric intensity inside a hollow charged sphere is:", options: ["Zero", "Maximum", "Infinite", "Negative"], correctOption: "Zero" },
      { text: "One electron volt (1 eV) is equal to:", options: ["1.6 x 10^-19 J", "1.6 x 10^19 J", "9.1 x 10^-31 J", "3 x 10^8 J"], correctOption: "1.6 x 10^-19 J" }
    ],
    shortQuestions: [
      { text: "State Coulomb's Law in electrostatics and write its vector form." },
      { text: "Define Electric Field Intensity and calculate its value due to a point charge." },
      { text: "Define Electric Potential at a point and establish relation between electric field and potential gradient: E = -dV/dr." }
    ],
    longQuestions: [
      { text: "State Gauss’s Law. Use Gauss’s Law to find the electric intensity due to an infinite sheet of charge." },
      { text: "Describe Millikan’s oil drop experiment to measure the charge on an electron with mathematical derivation." }
    ],
    numericals: [
      { text: "12.1: Compare the magnitudes of electrical and gravitational forces between two electrons separated by a distance r." },
      { text: "12.3: A point charge q = -8.0 x 10^-8 C is placed at the origin. Calculate electric field at a point 2 m from origin on the z-axis." }
    ]
  }
};

export const getQuestionsFromDatabase = (className: string, subject: string, chapters: string[]) => {
  const result = {
    mcqs: [] as Question[],
    shortQuestions: [] as Question[],
    longQuestions: [] as Question[],
    numericals: [] as Question[]
  };

  chapters.forEach(ch => {
    const key = `${className}|${subject}|${ch}`;
    let data = QUESTION_BANK[key];

    // If exact key not found, look for partial chapter name match
    if (!data) {
      const matchKey = Object.keys(QUESTION_BANK).find(k => 
        k.startsWith(`${className}|${subject}`) && (k.includes(ch) || ch.includes(k.split('|')[2]))
      );
      if (matchKey) {
        data = QUESTION_BANK[matchKey];
      }
    }

    if (data) {
      if (data.mcqs) {
        result.mcqs.push(...data.mcqs.map((q) => ({
          ...q,
          id: crypto.randomUUID(),
          type: QuestionType.MCQ,
          selected: true,
          chapter: ch,
          marks: 1
        })));
      }
      if (data.shortQuestions) {
        result.shortQuestions.push(...data.shortQuestions.map((q) => ({
          ...q,
          id: crypto.randomUUID(),
          type: QuestionType.SHORT,
          selected: true,
          chapter: ch,
          marks: 2
        })));
      }
      if (data.longQuestions) {
        result.longQuestions.push(...data.longQuestions.map((q) => ({
          ...q,
          id: crypto.randomUUID(),
          type: QuestionType.LONG,
          selected: true,
          chapter: ch,
          marks: 5
        })));
      }
      if (data.numericals) {
        result.numericals.push(...data.numericals.map((q) => ({
          ...q,
          id: crypto.randomUUID(),
          type: QuestionType.NUMERICAL,
          selected: true,
          chapter: ch,
          marks: 5
        })));
      }
    }
  });

  return result;
};