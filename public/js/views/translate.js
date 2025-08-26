const translations = {
    en: {
      loginBtn: "Log In",
      heroTitle: "Build exceptional teams with intelligent recruitment",
      heroSubtitle: "Modern recruitment platform designed for scaling companies who value quality over quantity.",
      featuresAside: "Features for Employers",
      paragraphAside: "Company Branding",
      paragraphAside_2: "Team Collaboration",
      paragraphAside_3: "ATS Integration",
      imgText: "Reduced our time-to-hire by 60%",
      imgText_2: "Sarah Chen, Head of Talent",
      introTitle: "Trusted by forward-thinking companies",
      introSubtitle: "Join industry leaders who rely on TalentTrack to build exceptional teams and scale their recruitment processes efficiently.",
      InnovateCorp: "InnovateCorp",
      DataFlow: "DataFlow",
      TechBuild: "TechBuild",
      GlobalTech: "GlobalTech",
      Innovate: "Innovate",
      featureMain: "Platform capabilities",
      featureMain_2: "Everything you need to build exceptional teams and streamline your recruitment process.",
      BrandConsistency: "Brand Consistency",
      paragraphMain: "Maintain your company's brand identity throughout the entire recruitment experience.",
      TeamCollaboration: "Team Collaboration",
      paragraphMain2: "Streamline communication and decision-making across your entire hiring team.",
      SeamlessIntegration: "Seamless Integration",
      paragraphMain3: "Connect with your existing tools and workflows without disruption.",
      paragraphImg: "Reduced our time-to-hire by 60% while improving candidate quality significantly.",
      titleMain: "Empowering Recruiters and Hiring Managers",
      paragraphMain4: "Join leading companies that trust TalentTrack to streamline their hiring workflow and discover top talent efficiently.",
      paragraphFooter: "Modern recruitment platform designed to help scaling companies build exceptional teams through intelligent candidate matching and data-driven insights.",
      GetItTouch: "Get in Touch",
      spanFooter: "All systems operational",
      footerText: "© 2025 TalentTrack. All rights reserved."
    },
    es: {
      loginBtn: "Iniciar sesión",
      heroTitle: "Construye equipos excepcionales con un reclutamiento inteligente",
      heroSubtitle: "Plataforma de reclutamiento moderna diseñada para empresas en crecimiento que valoran la calidad sobre la cantidad.",
      featuresAside: "Funciones para empleadores",
      paragraphAside: "Imagen de la empresa",
      paragraphAside_2: "Colaboración en equipo",
      paragraphAside_3: "Integración con ATS",
      imgText: "Reducimos nuestro tiempo de contratación en un 60%",
      imgText_2: "Sarah Chen, Jefa de Talento",
      introTitle: "Confiado por empresas visionarias",
      introSubtitle: "Únete a líderes de la industria que confían en TalentTrack para formar equipos excepcionales y optimizar sus procesos de reclutamiento.",
      InnovateCorp: "InnovateCorp",
      DataFlow: "DataFlow",
      TechBuild: "TechBuild",
      GlobalTech: "GlobalTech",
      Innovate: "Innovar",
      featureMain: "Capacidades de la plataforma",
      featureMain_2: "Todo lo que necesitas para construir equipos excepcionales y optimizar tu proceso de reclutamiento.",
      BrandConsistency: "Consistencia de marca",
      paragraphMain: "Mantén la identidad de marca de tu empresa durante toda la experiencia de reclutamiento.",
      TeamCollaboration: "Colaboración en equipo",
      paragraphMain2: "Optimiza la comunicación y la toma de decisiones en todo tu equipo de contratación.",
      SeamlessIntegration: "Integración sin interrupciones",
      paragraphMain3: "Conéctate con tus herramientas y flujos de trabajo existentes sin interrupciones.",
      paragraphImg: "Reducimos nuestro tiempo de contratación en un 60% mientras mejoramos significativamente la calidad de los candidatos.",
      titleMain: "Empoderando a reclutadores y gerentes de contratación",
      paragraphMain4: "Únete a empresas líderes que confían en TalentTrack para optimizar su flujo de trabajo y descubrir el mejor talento de manera eficiente.",
      paragraphFooter: "Plataforma moderna de reclutamiento diseñada para ayudar a las empresas en crecimiento a construir equipos excepcionales mediante la coincidencia inteligente de candidatos y el análisis basado en datos.",
      GetItTouch: "Ponte en contacto",
      spanFooter: "Todos los sistemas operativos",
      footerText: "© 2025 TalentTrack. Todos los derechos reservados."
    }
  };
  
  
  function setLanguage(lang) {
    for (const [id, text] of Object.entries(translations[lang])) {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    }
  }
  
  // Events
  document.getElementById("btn-en").addEventListener("click", () => setLanguage("en"));
  document.getElementById("btn-es").addEventListener("click", () => setLanguage("es"));
  