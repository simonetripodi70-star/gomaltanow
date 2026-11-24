// Guide passo-passo per le pagine "Move to Malta".
// Ogni pagina guida mostra il blocco <MoveGuideDetail guide="..."/>.

export type GuideStep = {
  title: string;
  text: string;
  where?: string;
  cost?: string;
  time?: string;
  link?: { label: string; url: string };
};

export type MoveGuide = {
  kicker: string;
  title: string;
  intro: string;
  steps: GuideStep[];
  costs: { label: string; value: string }[];
  faq: { question: string; answer: string }[];
  sources: { name: string; url: string }[];
  lastChecked: string;
};

const IDENTITA_EU = {
  name: "Identità – EU nationals (Expatriates Unit)",
  url: "https://identita.gov.mt/expatriates-unit-main-page/eu-nationals/",
};
const IDENTITA_SP = {
  name: "Identità – Single Permit application and fees",
  url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/single-permit-application/",
};
const IDENTITA_WORK = {
  name: "Identità – Working and residing in Malta",
  url: "https://identita.gov.mt/working-residing-in-malta/",
};
const PREDEP = {
  name: "Home Affairs – Pre-Departure Course",
  url: "https://homeaffairs.gov.mt/predeparture-course/",
};
const SSN = {
  name: "Department of Social Security – Social Security Number",
  url: "https://socialsecurity.gov.mt/en/information-and-applications-for-benefits-and-services/registration-for-a-social-security-number",
};
const JOBSPLUS = { name: "Jobsplus – vacancies and employment forms", url: "https://jobsplus.gov.mt/" };
const RENT = {
  name: "Housing Authority – rent registration",
  url: "https://housingauthority.gov.mt/mt/services/rent-registration/",
};
const RENT_SERVIZZ = {
  name: "Servizz.gov – registration of a private residential lease",
  url: "https://www.servizz.gov.mt/en/Services/web-05163",
};
const ENTITLEMENT = {
  name: "Healthcare Entitlement Unit – healthcare in Malta",
  url: "https://s2.eessi.gov.mt/en/information-regarding-healthcare-in-malta/",
};
const MTCA = { name: "Malta Tax and Customs Administration", url: "https://mtca.gov.mt/" };
const BUDGET27 = {
  name: "MaltaToday – Budget 2027 and third-country nationals",
  url: "https://www.maltatoday.com.mt/news/budget-2027/145287/budget_2027__more_fees_less_benefits_for_thirdcountry_nationals",
};

const TAX_FAQ = {
  question: "How much income tax will I pay in Malta?",
  answer:
    "Residents pay progressive income tax. On the 2026 'single' rates: 0% up to €12,000, 15% from €12,001 to €16,000, 25% from €16,001 to €60,000 and 35% above €60,000. Married and parent rates are more favourable. Employees also pay social security contributions of about 10% of their basic wage, up to a weekly cap.",
};

const RENT_STEPS: GuideStep[] = [
  {
    title: "Start with a short stay",
    text: "Book 2–4 weeks in a short let or hotel so you can view flats in person. Many listings disappear within days, and photos can be misleading.",
    time: "First 2–4 weeks",
  },
  {
    title: "Choose the area and set a budget",
    text: "Sliema, St Julian's, Gżira, Msida and Swieqi are central and popular, so they cost more. Areas in the south and north, and towns such as Birkirkara, Mosta or Żabbar, are usually cheaper. Check bus links to your workplace on the Tallinja app.",
  },
  {
    title: "Search and view properties",
    text: "Use the big property portals and agencies, plus Facebook groups (be careful of scams). Never pay a deposit before seeing the flat and the owner's or agent's details. Agencies often charge the tenant a fee – ask before viewing.",
  },
  {
    title: "Check the contract",
    text: "Long private leases must be in writing and last at least one year. The contract must state the rent, deposit, duration and the property, and include a signed inventory of furniture and appliances. Photograph everything on the day you move in.",
  },
  {
    title: "Make sure the lease is registered",
    text: "The landlord must register the lease with the Housing Authority within 30 days of the start date. An unregistered lease is legally void, and you will need the registration approval letter for your Identità residence application.",
    where: "Housing Authority online portal (landlord)",
    cost: "Free for the tenant",
    link: { label: "Rent registration", url: "https://housingauthority.gov.mt/mt/services/rent-registration/" },
  },
  {
    title: "Set up utilities at the residential tariff",
    text: "Water and electricity are billed by ARMS Ltd. Ask the landlord to register you as a resident occupant so you pay the cheaper residential tariff, not the higher non-residential one. Internet and mobile are offered by GO, Epic and Melita.",
    where: "ARMS Ltd · internet providers",
  },
];

export const MOVE_GUIDES: Record<string, MoveGuide> = {
  /* ---------------------------- EU CITIZENS ---------------------------- */
  "eu/before-you-move": {
    kicker: "Step-by-step guide",
    title: "Before you move to Malta: what to sort out at home.",
    intro:
      "As an EU, EEA or Swiss citizen you do not need a visa or work permit for Malta. What you do need is the right paperwork, enough money for the first months and a plan for housing. These are the steps to complete before you leave.",
    steps: [
      {
        title: "Check your identity documents",
        text: "Make sure your passport or national ID card is valid for your whole stay. Identità uses it for your residence card, and banks will ask for it too.",
      },
      {
        title: "Gather civil documents",
        text: "If your partner or children come with you, bring birth and marriage certificates. Documents not in English or Maltese must be translated by a certified translator, or apostilled/legalised.",
        link: { label: "Identità – public documents", url: "https://identita.gov.mt/?p=5431" },
      },
      {
        title: "Get your EHIC and check health cover",
        text: "Bring your European Health Insurance Card for the first weeks. If you will not work in Malta (for example you live on savings or a pension), you will need comprehensive health insurance or an S1 form to register your residence.",
      },
      {
        title: "Have your qualifications recognised",
        text: "For regulated jobs (nurses, teachers, engineers and others) you need recognition by the competent authority. MQRIC can compare your foreign qualifications with the Maltese framework.",
      },
      {
        title: "Plan your first month's budget",
        text: "Count on a deposit (usually one month's rent), the first month's rent, a possible agency fee and living costs until your first salary. Rent is the biggest cost in Malta.",
      },
      {
        title: "Book a short stay and start your job search",
        text: "Arrange 2–4 weeks of temporary accommodation and send applications before you leave. Many employers interview online.",
      },
      {
        title: "Check your home country's rules",
        text: "Some countries ask citizens to register when they move abroad (for example Italy's AIRE). Check tax residence and pension rules with your home authorities.",
      },
    ],
    costs: [
      { label: "Visa or work permit", value: "Not needed for EU/EEA/Swiss citizens" },
      { label: "Residence card (eResidence)", value: "Free for EU nationals" },
      { label: "Deposit", value: "Usually one month's rent" },
      { label: "Certified translations", value: "Depends on the translator and number of pages" },
    ],
    faq: [
      {
        question: "Do EU citizens need a work permit for Malta?",
        answer: "No. EU, EEA and Swiss citizens can live and work in Malta freely. If you stay more than three months you must register your residence with Identità.",
      },
      {
        question: "Can I use my EU driving licence in Malta?",
        answer: "Yes, a valid EU driving licence is recognised in Malta.",
      },
    ],
    sources: [IDENTITA_EU, ENTITLEMENT],
    lastChecked: "November 2026",
  },

  "eu/residence": {
    kicker: "Step-by-step guide",
    title: "How to register your residence in Malta as an EU citizen.",
    intro:
      "If you live or work in Malta for more than three months, you must register with Identità and get a residence card (eResidence document). For EU nationals it is free. Here is the full process.",
    steps: [
      {
        title: "Get your address in order",
        text: "You need an address in Malta. If you rent, the landlord must register the lease with the Housing Authority; you will be asked for the registration approval letter.",
        time: "Before applying",
      },
      {
        title: "Register your job or activity",
        text: "If you are employed, your employer must submit the Jobsplus engagement form on your first day. If you are self-employed, register with Jobsplus as self-employed (you will also need a VAT number). Students and self-sufficient people need proof of enrolment or income instead.",
        where: "Jobsplus",
      },
      {
        title: "Apply online on the Identità portal",
        text: "Submit your application through the Expatriates Unit online portal on the right basis (employment, self-employment, self-sufficient, student, family member). Upload a copy of your passport or ID and the supporting documents.",
        where: "Identità Expatriates Unit portal",
        cost: "Free",
        link: { label: "Identità – EU nationals", url: "https://identita.gov.mt/expatriates-unit-main-page/eu-nationals/" },
      },
      {
        title: "Attend the biometrics appointment",
        text: "Book your appointment and bring the originals of every document you uploaded. Your photo and fingerprints are taken at the Identità offices in Msida.",
        where: "Identità, Triq il-Wied, Msida",
      },
      {
        title: "Collect your residence card",
        text: "Once approved you receive the eResidence card. Its number (ending in 'A') is also used as your tax and social security reference.",
      },
      {
        title: "Keep it up to date",
        text: "Report changes of address or job, and renew before the card expires. The card must be shown to the police on request or within 24 hours. After five years of continuous legal residence you can apply for permanent residence.",
      },
    ],
    costs: [
      { label: "First registration and renewal", value: "Free for EU/EEA nationals" },
      { label: "Damaged card", value: "€16.50" },
      { label: "Lost or stolen card", value: "€22 (with a police report)" },
    ],
    faq: [
      {
        question: "When must an EU citizen register in Malta?",
        answer: "If you stay or work in Malta for more than three months you must register your residence with Identità.",
      },
      {
        question: "How much is the residence card for EU citizens?",
        answer: "It is free. You pay only to replace a damaged (€16.50) or lost (€22) card.",
      },
      {
        question: "Do I need health insurance to register?",
        answer: "Not if you work and pay social security in Malta. Self-sufficient residents and some students must show comprehensive health insurance or an S1 form.",
      },
    ],
    sources: [IDENTITA_EU, { name: "Identità – FAQ for EU nationals", url: "https://identita.gov.mt/frequently-asked-questions/expatriates/expatriates-eu-nationals/" }, RENT],
    lastChecked: "November 2026",
  },

  "eu/find-a-job": {
    kicker: "Step-by-step guide",
    title: "Finding a job in Malta as an EU citizen.",
    intro:
      "EU citizens can work in Malta without a permit. The labour market is strong in iGaming, financial services, IT, tourism, healthcare and customer support. These are the steps from search to first payslip.",
    steps: [
      {
        title: "Prepare an English CV",
        text: "English is the working language in most companies. Keep your CV to 1–2 pages and add your availability date and whether you are already in Malta.",
      },
      {
        title: "Search the right channels",
        text: "Use the Jobsplus vacancy portal, EURES, LinkedIn, Maltese job sites and specialised recruitment agencies (especially for iGaming, finance and IT).",
        where: "Jobsplus · EURES · LinkedIn",
        link: { label: "Jobsplus vacancies", url: "https://jobsplus.gov.mt/" },
      },
      {
        title: "Understand the offer",
        text: "Check gross salary, hours, probation (usually six months), leave and notice period. Full-time workers get at least 192 hours of paid annual leave, plus extra days when a public holiday falls on a weekend.",
      },
      {
        title: "Sign the contract and start work",
        text: "On your first day the employer must send the Jobsplus engagement form. You then receive an acknowledgement by email or post.",
        where: "Employer → Jobsplus",
      },
      {
        title: "Get your social security number",
        text: "Since July 2025 the social security number is issued automatically once the engagement form is registered, if you are eligible. If you have a Maltese residence card ending in 'A', that number is used.",
        link: { label: "Social Security Number", url: "https://socialsecurity.gov.mt/en/information-and-applications-for-benefits-and-services/registration-for-a-social-security-number" },
      },
      {
        title: "Check your payslip and tax",
        text: "Tax (FSS) and social security are deducted from your salary every month. In February you receive the FS3, a summary of your income and tax for the previous year.",
      },
    ],
    costs: [
      { label: "Work permit", value: "Not needed" },
      { label: "Social security (employee)", value: "About 10% of basic wage, capped" },
      { label: "Income tax 2026 (single)", value: "0% to €12,000 · then 15%, 25% and 35%" },
    ],
    faq: [
      TAX_FAQ,
      {
        question: "Can I start working before I have my residence card?",
        answer: "Yes. You can start working straight away; your employer registers you with Jobsplus and you apply for the residence card if you stay more than three months.",
      },
    ],
    sources: [JOBSPLUS, SSN, MTCA],
    lastChecked: "November 2026",
  },

  "eu/find-a-home": {
    kicker: "Step-by-step guide",
    title: "Renting a home in Malta: step by step.",
    intro:
      "Finding a flat is often the hardest part of moving to Malta. Rents are high in the central areas and good places go fast. Follow these steps to rent safely and legally.",
    steps: RENT_STEPS,
    costs: [
      { label: "Deposit", value: "Usually one month's rent" },
      { label: "Agency fee", value: "Often charged to the tenant – ask before viewing" },
      { label: "Minimum long lease", value: "1 year" },
      { label: "Lease registration", value: "By the landlord within 30 days" },
    ],
    faq: [
      {
        question: "Does the landlord have to register the lease?",
        answer: "Yes. Private residential leases must be registered with the Housing Authority within 30 days of the start; otherwise the lease is void.",
      },
      {
        question: "How long is a rental contract in Malta?",
        answer: "A long private residential lease must last at least one year. Short leases of up to six months are allowed only for specific reasons, such as work or study.",
      },
    ],
    sources: [RENT, RENT_SERVIZZ],
    lastChecked: "November 2026",
  },

  "eu/healthcare": {
    kicker: "Step-by-step guide",
    title: "Healthcare in Malta for EU citizens.",
    intro:
      "Malta's public healthcare is free for people who are entitled to it. As an EU citizen your entitlement depends on whether you work in Malta, are posted, retired or self-sufficient.",
    steps: [
      {
        title: "Use your EHIC at the start",
        text: "During the first weeks, your European Health Insurance Card covers necessary treatment in public hospitals and health centres.",
      },
      {
        title: "If you work in Malta: pay social security",
        text: "Once you are employed or self-employed and pay Maltese social security contributions, you are entitled to free public healthcare like Maltese residents. Keep your residence card and payslips.",
      },
      {
        title: "If you are posted or retired: register your S1",
        text: "Ask your home country for an S1 form and register it with the Entitlement Unit at St Luke's Hospital. You receive a Certificate of Entitlement to show at public hospitals and health centres.",
        where: "Entitlement Unit, St Luke's Hospital, G'Mangia",
        link: { label: "Entitlement Unit", url: "https://s2.eessi.gov.mt/en/information-regarding-healthcare-in-malta/" },
      },
      {
        title: "If you do not work: take private insurance",
        text: "Self-sufficient residents need comprehensive health insurance covering inpatient and outpatient care in Malta to register their residence.",
      },
      {
        title: "Know where to go",
        text: "Health centres (polyclinics) offer free GP and nurse services. Mater Dei Hospital is the main hospital in Malta and Gozo General Hospital serves Gozo. Many people also use private GPs and clinics for shorter waiting times.",
      },
      {
        title: "Emergencies",
        text: "Call 112 for an ambulance, police or fire service. Pharmacies are everywhere; a rota covers nights and Sundays.",
      },
    ],
    costs: [
      { label: "Public health centres and hospitals", value: "Free if entitled" },
      { label: "Private GP visit", value: "Paid – ask the clinic" },
      { label: "Emergency number", value: "112" },
    ],
    faq: [
      {
        question: "Is healthcare free in Malta for EU citizens?",
        answer: "Yes, if you are entitled: for example if you work and pay social security in Malta, or have registered an S1 form. Otherwise use your EHIC for temporary stays or private insurance.",
      },
    ],
    sources: [ENTITLEMENT, IDENTITA_EU],
    lastChecked: "November 2026",
  },

  "eu/banking-payments": {
    kicker: "Step-by-step guide",
    title: "Opening a bank account and paying in Malta.",
    intro:
      "Opening a Maltese bank account can take a few weeks because of identity checks. The good news is that you can be paid into any euro (SEPA) account in the meantime.",
    steps: [
      {
        title: "Arrive with a euro account",
        text: "An EU account or an app such as Revolut or Wise lets you pay and receive your salary from day one. Employers in the EU must accept any SEPA IBAN.",
      },
      {
        title: "Choose a Maltese bank",
        text: "The main retail banks are Bank of Valletta, HSBC Malta, APS Bank, Lombard and BNF. Compare monthly fees, card fees and online banking.",
      },
      {
        title: "Prepare your documents",
        text: "Usually: passport or ID, proof of address in Malta (registered lease or utility bill), employment contract or letter, and your residence card or tax number. Banks may ask about the source of your funds.",
      },
      {
        title: "Book an appointment or apply online",
        text: "Some banks let you start online; others need a branch visit. Expect identity checks to take from a few days to several weeks.",
        time: "Days to weeks",
      },
      {
        title: "Pay bills and taxes",
        text: "Cards and contactless are accepted almost everywhere, but some small shops and kiosks still prefer cash. Utility bills (ARMS) and government payments can be paid online.",
      },
    ],
    costs: [
      { label: "Account fees", value: "Vary by bank – compare before choosing" },
      { label: "Salary into a foreign EU IBAN", value: "Allowed under SEPA rules" },
    ],
    faq: [
      {
        question: "Do I need a Maltese bank account?",
        answer: "Not at the beginning: you can use any euro SEPA account. A local account is useful in the long term for some payments and loans.",
      },
    ],
    sources: [MTCA, IDENTITA_EU],
    lastChecked: "November 2026",
  },

  /* ---------------------------- NON-EU ---------------------------- */
  "non-eu/before-you-move": {
    kicker: "Step-by-step guide",
    title: "Before you move to Malta from outside the EU.",
    intro:
      "Most non-EU citizens come to Malta to work with a Single Permit, which the employer applies for while you are still abroad. Since 2026 there is also a mandatory online course. These are the steps to follow before you travel.",
    steps: [
      {
        title: "Find an employer in Malta",
        text: "You need a job offer from a Maltese employer. The employer must first advertise the vacancy for at least three weeks to check that no local or EU worker is available.",
      },
      {
        title: "Complete the Pre-Departure Course",
        text: "All first-time Single Permit applicants must pass the online Pre-Departure Course on the Skills Pass portal. Hospitality and tourism jobs also need a Skills Pass.",
        cost: "€250 · Skills Pass (tourism) €230",
        link: { label: "Pre-Departure Course", url: "https://homeaffairs.gov.mt/predeparture-course/" },
      },
      {
        title: "Prepare your documents",
        text: "A valid passport, police conduct certificate, qualifications and work references. Documents not in English must be translated and, where required, apostilled or legalised.",
      },
      {
        title: "Let your employer apply",
        text: "The employer submits the Single Permit application on the Identità online portal. A decision can take up to four months.",
        cost: "€600 (€800 announced from January 2027)",
      },
      {
        title: "Apply for the entry visa",
        text: "If your nationality needs a visa, apply for a national long-stay (D) visa after approval, at the Maltese embassy or its visa service provider.",
        cost: "From €150",
      },
      {
        title: "Plan your budget",
        text: "Count on a deposit and first month's rent, living costs until your first salary, and the Budget 2027 changes: from 2027, third-country nationals with less than five years in Malta lose free public transport and free childcare.",
        link: { label: "Budget 2027 changes", url: BUDGET27.url },
      },
    ],
    costs: [
      { label: "Pre-Departure Course", value: "€250" },
      { label: "Skills Pass (tourism and hospitality)", value: "€230" },
      { label: "First Single Permit", value: "€600 · €800 announced from 2027" },
      { label: "National D visa", value: "From €150" },
    ],
    faq: [
      {
        question: "Can I come to Malta as a tourist and then apply for a work permit?",
        answer: "No. A first Single Permit cannot be obtained by applying from Malta on a tourist visa; the process starts while you are abroad.",
      },
      {
        question: "How long does the Single Permit take?",
        answer: "Identità can take up to four months to decide.",
      },
    ],
    sources: [PREDEP, IDENTITA_SP, IDENTITA_WORK, BUDGET27],
    lastChecked: "November 2026",
  },

  "non-eu/single-permit": {
    kicker: "Step-by-step guide",
    title: "The Malta Single Permit, step by step.",
    intro:
      "The Single Permit combines your work and residence permission in one card. It is issued by Identità, is linked to one employer and one job, and is the most common route for non-EU workers.",
    steps: [
      {
        title: "Job offer and labour market test",
        text: "The employer advertises the job for at least three weeks within the two months before applying, then signs a contract with you.",
        where: "Employer · Jobsplus",
      },
      {
        title: "Pre-Departure Course certificate",
        text: "Complete and pass the Pre-Departure Course on the Skills Pass portal. Without a valid certificate, first-time applications are not processed.",
        cost: "€250",
        link: { label: "Pre-Departure Course", url: "https://homeaffairs.gov.mt/predeparture-course/" },
      },
      {
        title: "Online application by the employer",
        text: "The employer uploads the documents on the Single Permit portal: your passport, contract, Jobsplus declaration of suitability, qualifications and other checklist items. The fee is paid online before final submission.",
        where: "Identità Single Permit portal",
        cost: "€600 (€800 announced from January 2027)",
        link: { label: "Single Permit application", url: IDENTITA_SP.url },
      },
      {
        title: "Checks and decision",
        text: "Identità, Jobsplus and the police check the application. The decision can take up to four months. You may be asked for more documents.",
        time: "Up to 4 months",
      },
      {
        title: "Visa, travel and biometrics",
        text: "After approval, apply for a D visa if needed, travel to Malta and attend your biometrics appointment at Identità to receive the card. Complete any health screening you are asked to do.",
      },
      {
        title: "Start work and stay compliant",
        text: "You can only work for the employer and in the role on your permit. Changing employer or role needs a new application. Renew up to 90 days before expiry.",
        cost: "Renewal €150 per year (higher fees announced for 2027)",
      },
    ],
    costs: [
      { label: "First-time Single Permit", value: "€600 · €800 announced from January 2027" },
      { label: "Renewal", value: "€150 per year (increase announced in Budget 2027)" },
      { label: "Change of employer", value: "New application (€600)" },
      { label: "Pre-Departure Course", value: "€250" },
    ],
    faq: [
      {
        question: "Who pays for the Single Permit?",
        answer: "The fee is paid online by either the employer or the worker before the application is submitted.",
      },
      {
        question: "Can I change job with a Single Permit?",
        answer: "Yes, but the new employer must submit a new application, because the permit is tied to a specific employer and role.",
      },
    ],
    sources: [IDENTITA_SP, IDENTITA_WORK, PREDEP, BUDGET27],
    lastChecked: "November 2026",
  },

  "non-eu/residence": {
    kicker: "Step-by-step guide",
    title: "Residence permits in Malta for non-EU citizens.",
    intro:
      "As a non-EU citizen you need a residence permit for any stay longer than your visa. The right permit depends on why you come: work, remote work, family or long-term residence.",
    steps: [
      {
        title: "Choose the right route",
        text: "Employees: Single Permit (through the employer). Remote workers for a foreign company: Nomad Residence Permit (Residency Malta). Family of a resident: family reunification. After five years of legal residence: long-term residence.",
      },
      {
        title: "Secure your address",
        text: "You need an address in Malta, usually a lease registered by the landlord with the Housing Authority. Keep the registration approval letter.",
        link: { label: "Rent registration", url: RENT.url },
      },
      {
        title: "Submit the application",
        text: "Applications are made online (for the Single Permit by the employer) with your passport, contract or proof of income, health insurance and address documents.",
        where: "Identità or Residency Malta",
      },
      {
        title: "Biometrics and card",
        text: "Attend the biometrics appointment and collect your residence card. Carry it with you and keep a copy of your passport.",
      },
      {
        title: "Keep your permit valid",
        text: "Tell Identità if your job ends or your situation changes. Submit renewals up to 90 days before the card expires.",
      },
    ],
    costs: [
      { label: "First Single Permit", value: "€600 · €800 announced from 2027" },
      { label: "Nomad Residence Permit", value: "€300 application + €100 card" },
      { label: "Long-term residence", value: "Higher fee announced from 2027" },
    ],
    faq: [
      {
        question: "What happens if I lose my job?",
        answer: "Your permit is linked to your employment. Inform Identità; you have a limited period to find a new employer, who must submit a new application.",
      },
    ],
    sources: [IDENTITA_WORK, IDENTITA_SP, { name: "Residency Malta – Nomad Residence Permit", url: "https://nomad.residencymalta.gov.mt/" }, BUDGET27],
    lastChecked: "November 2026",
  },

  "non-eu/find-a-job": {
    kicker: "Step-by-step guide",
    title: "Finding a job in Malta from outside the EU.",
    intro:
      "To work in Malta you need an employer willing to apply for your Single Permit. Demand for non-EU workers is highest in care and healthcare, hospitality, construction, transport and cleaning.",
    steps: [
      {
        title: "Target sectors that hire non-EU workers",
        text: "Care homes, hospitals, hotels and restaurants, construction, logistics and delivery often recruit abroad. Specialised roles (IT, finance, iGaming) may qualify for fast-track schemes.",
      },
      {
        title: "Search official and trusted channels",
        text: "Look at the Jobsplus vacancy portal and employers' own careers pages. If you use an agency, check that it holds a Jobsplus employment agency licence.",
        link: { label: "Jobsplus", url: "https://jobsplus.gov.mt/" },
      },
      {
        title: "Never pay for a job",
        text: "Be very careful with anyone who asks you for money in exchange for a job offer or a permit. Official fees are paid to Identità and the Skills Pass portal.",
      },
      {
        title: "Get a written contract",
        text: "Check salary, hours, overtime, accommodation (if offered) and the job title: the permit is tied to that employer and role.",
      },
      {
        title: "Start the permit process",
        text: "Complete the Pre-Departure Course, then the employer submits the Single Permit application. See our Single Permit guide for every step.",
      },
    ],
    costs: [
      { label: "Pre-Departure Course", value: "€250" },
      { label: "First Single Permit", value: "€600 · €800 announced from 2027" },
    ],
    faq: [
      TAX_FAQ,
      {
        question: "Can I look for a job while in Malta as a tourist?",
        answer: "You can attend interviews, but a first Single Permit cannot be obtained by applying from Malta on a tourist visa.",
      },
    ],
    sources: [JOBSPLUS, IDENTITA_SP, PREDEP],
    lastChecked: "November 2026",
  },

  "non-eu/find-a-home": {
    kicker: "Step-by-step guide",
    title: "Renting a home in Malta as a non-EU citizen.",
    intro:
      "The rules for renting are the same for everyone, but as a non-EU resident a registered lease is especially important: Identità uses it to confirm your address.",
    steps: RENT_STEPS,
    costs: [
      { label: "Deposit", value: "Usually one month's rent" },
      { label: "Minimum long lease", value: "1 year" },
      { label: "Lease registration", value: "By the landlord within 30 days" },
    ],
    faq: [
      {
        question: "Why do I need a registered lease?",
        answer: "An unregistered private residential lease is void, and Identità asks for the Housing Authority registration letter to confirm your address.",
      },
    ],
    sources: [RENT, RENT_SERVIZZ, { name: "Identità – lease registration requirements", url: "https://identita.gov.mt/?p=4300" }],
    lastChecked: "November 2026",
  },

  "non-eu/healthcare": {
    kicker: "Step-by-step guide",
    title: "Healthcare in Malta for non-EU residents.",
    intro:
      "Non-EU workers who pay Maltese social security can use public healthcare. Until then, and for some permits, private health insurance is required.",
    steps: [
      {
        title: "Arrive with health insurance",
        text: "Your permit application usually requires health insurance. Keep it active until your public healthcare entitlement is confirmed.",
      },
      {
        title: "Complete the health screening",
        text: "New third-country nationals may be asked to complete a medical screening after arrival. Follow the instructions you receive with your permit.",
      },
      {
        title: "Work and pay social security",
        text: "Once you work and pay contributions, you can use public health centres and hospitals. Your employer's Jobsplus registration and your residence card prove your status.",
      },
      {
        title: "Know where to go",
        text: "Health centres for GP visits, Mater Dei Hospital for emergencies and specialists, Gozo General Hospital in Gozo. Private clinics are faster but paid.",
      },
      {
        title: "Emergencies",
        text: "Call 112 for an ambulance. Keep your residence card and insurance details with you.",
      },
    ],
    costs: [
      { label: "Public healthcare", value: "Free if entitled" },
      { label: "Private insurance", value: "Depends on age and cover" },
      { label: "Emergency number", value: "112" },
    ],
    faq: [
      {
        question: "Do non-EU workers get free healthcare in Malta?",
        answer: "Workers who live legally in Malta and pay social security can use public healthcare. Keep private insurance until your entitlement is confirmed.",
      },
    ],
    sources: [IDENTITA_WORK, ENTITLEMENT],
    lastChecked: "November 2026",
  },

  "non-eu/banking-payments": {
    kicker: "Step-by-step guide",
    title: "Banking and payments in Malta for non-EU residents.",
    intro:
      "Banks in Malta apply strict identity checks, and for non-EU customers opening an account can take longer. Prepare the documents in advance and use an e-money account in the meantime.",
    steps: [
      {
        title: "Wait for your residence card",
        text: "Most banks ask for your Maltese residence card together with your passport. Apply once you have it.",
      },
      {
        title: "Prepare proof of address and income",
        text: "A registered lease, your employment contract or employer letter and recent payslips.",
      },
      {
        title: "Choose a bank and apply",
        text: "Bank of Valletta, HSBC Malta, APS Bank, Lombard and BNF are the main banks. Some start the process online. Checks can take several weeks.",
        time: "Days to weeks",
      },
      {
        title: "Use an e-money account meanwhile",
        text: "Apps such as Revolut or Wise may be available depending on your nationality and residence. Check with your employer which IBANs they accept for salary.",
      },
      {
        title: "Send money home safely",
        text: "Compare fees and exchange rates of banks and money-transfer services. Avoid informal transfers.",
      },
    ],
    costs: [{ label: "Account fees", value: "Vary by bank" }],
    faq: [
      {
        question: "Can a non-EU citizen open a bank account in Malta?",
        answer: "Yes, usually with a passport, Maltese residence card, proof of address and proof of employment. Checks may take several weeks.",
      },
    ],
    sources: [IDENTITA_WORK, MTCA],
    lastChecked: "November 2026",
  },
};
