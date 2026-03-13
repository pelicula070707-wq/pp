require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ══════════════════════════════════════════════════
//  HTML + CSS + JS todo en uno (sin archivos externos)
// ══════════════════════════════════════════════════
const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Barber & Co. — The Art of Grooming</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Josefin+Sans:wght@100;200;300;400&display=swap" rel="stylesheet">
  <style>
    :root {
      --gold:#c9a84c; --gold-light:#e8c97a; --gold-dim:#8a6f32;
      --dark-0:#060608; --dark-1:#0d0d10; --dark-2:#131317; --dark-3:#1a1a1f; --dark-4:#222228;
      --cream:#f5f0e8; --cream-dim:#d4c9b0; --text-muted:#888890; --text-faint:#555560;
      --border:rgba(201,168,76,0.15); --border-subtle:rgba(255,255,255,0.05);
      --ff-display:'Cormorant Garamond',serif; --ff-sans:'Josefin Sans',sans-serif;
      --t:all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:var(--dark-0);color:var(--cream);font-family:var(--ff-sans);font-weight:300;line-height:1.7;overflow-x:hidden}
    ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:var(--dark-1)} ::-webkit-scrollbar-thumb{background:var(--gold-dim)}
    h1,h2,h3,h4{font-family:var(--ff-display);font-weight:300;line-height:1.15}
    p{color:var(--cream-dim)}
    .label{font-family:var(--ff-sans);font-size:10px;font-weight:200;letter-spacing:5px;text-transform:uppercase;color:var(--gold)}
    .container{max-width:1200px;margin:0 auto;padding:0 40px}
    .divider{width:1px;height:60px;background:linear-gradient(to bottom,transparent,var(--gold),transparent);margin:0 auto}
    .h-divider{width:80px;height:1px;background:linear-gradient(to right,transparent,var(--gold),transparent);margin:0 auto}
    nav{position:fixed;top:0;left:0;right:0;z-index:100;transition:var(--t)}
    nav.scrolled{background:rgba(6,6,8,0.96);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
    .nav-inner{display:flex;align-items:center;justify-content:space-between;padding:24px 40px;max-width:1400px;margin:0 auto}
    .nav-logo{font-family:var(--ff-display);font-size:22px;letter-spacing:3px;color:var(--cream);text-decoration:none}
    .nav-logo span{color:var(--gold)}
    .nav-links{display:flex;gap:40px;list-style:none}
    .nav-links a{font-size:10px;font-weight:200;letter-spacing:4px;text-transform:uppercase;color:var(--text-muted);text-decoration:none;transition:color 0.3s}
    .nav-links a:hover{color:var(--gold)}
    .nav-cta{padding:10px 24px !important;border:1px solid var(--gold) !important;color:var(--gold) !important}
    .nav-cta:hover{background:var(--gold) !important;color:var(--dark-0) !important}
    #hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden}
    .hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 60% 40%,rgba(201,168,76,0.06) 0%,transparent 60%),linear-gradient(160deg,#0d0d10 0%,#060608 50%,#0a0a0c 100%)}
    .hero-lines{position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px);background-size:80px 80px;mask-image:radial-gradient(ellipse at center,transparent 20%,black 70%)}
    .hero-content{position:relative;z-index:2;max-width:1400px;margin:0 auto;padding:120px 40px 0}
    .hero-est{font-size:10px;font-weight:200;letter-spacing:8px;text-transform:uppercase;color:var(--gold);margin-bottom:24px;opacity:0;animation:fadeUp 0.8s 0.3s forwards}
    .hero-title{font-size:clamp(64px,9vw,130px);font-weight:300;line-height:0.95;letter-spacing:-2px;color:var(--cream);margin-bottom:8px;opacity:0;animation:fadeUp 0.8s 0.5s forwards}
    .hero-title em{font-style:italic;color:var(--gold)}
    .hero-subtitle{font-size:clamp(40px,5vw,76px);font-weight:300;letter-spacing:-1px;color:var(--text-faint);margin-bottom:40px;opacity:0;animation:fadeUp 0.8s 0.7s forwards}
    .hero-desc{font-size:12px;font-weight:200;letter-spacing:2px;color:var(--text-muted);max-width:360px;line-height:2;margin-bottom:48px;opacity:0;animation:fadeUp 0.8s 0.9s forwards}
    .hero-actions{display:flex;align-items:center;gap:32px;opacity:0;animation:fadeUp 0.8s 1.1s forwards}
    .btn-primary{display:inline-block;padding:16px 40px;background:var(--gold);color:var(--dark-0);font-family:var(--ff-sans);font-size:10px;font-weight:400;letter-spacing:4px;text-transform:uppercase;text-decoration:none;transition:var(--t)}
    .btn-primary:hover{background:var(--gold-light);transform:translateY(-2px);box-shadow:0 12px 40px rgba(201,168,76,0.25)}
    .btn-secondary{display:inline-flex;align-items:center;gap:12px;font-size:10px;font-weight:200;letter-spacing:4px;text-transform:uppercase;color:var(--cream-dim);text-decoration:none;transition:color 0.3s}
    .btn-secondary::after{content:'→';transition:transform 0.3s}
    .btn-secondary:hover{color:var(--gold)} .btn-secondary:hover::after{transform:translateX(4px)}
    #stats{background:var(--dark-2);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
    .stats-inner{display:grid;grid-template-columns:repeat(4,1fr)}
    .stat-item{padding:50px 30px;text-align:center;border-right:1px solid var(--border-subtle)}
    .stat-item:last-child{border-right:none}
    .stat-number{font-family:var(--ff-display);font-size:52px;font-weight:300;color:var(--gold);line-height:1;display:block}
    .stat-label{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--text-muted);margin-top:8px;display:block}
    section{padding:120px 0}
    .section-header{text-align:center;margin-bottom:80px}
    .section-title{font-size:clamp(42px,5vw,72px);font-weight:300;color:var(--cream);margin:16px 0;letter-spacing:-1px}
    .section-desc{font-size:13px;font-weight:200;letter-spacing:1px;color:var(--text-muted);max-width:480px;margin:0 auto}
    #servicios{background:var(--dark-1)}
    .services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border-subtle);border:1px solid var(--border-subtle)}
    .service-card{background:var(--dark-2);padding:50px 40px;position:relative;transition:var(--t);overflow:hidden}
    .service-card::before{content:'';position:absolute;bottom:0;left:0;width:100%;height:2px;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform 0.4s}
    .service-card:hover{background:var(--dark-3)} .service-card:hover::before{transform:scaleX(1)}
    .service-icon{font-size:28px;margin-bottom:20px;display:block}
    .service-name{font-family:var(--ff-display);font-size:26px;font-weight:400;color:var(--cream);margin-bottom:12px}
    .service-desc{font-size:12px;font-weight:200;color:var(--text-muted);line-height:1.8;margin-bottom:24px}
    .service-price{font-family:var(--ff-display);font-size:32px;color:var(--gold);font-weight:300}
    .service-price span{font-family:var(--ff-sans);font-size:11px;font-weight:200;letter-spacing:2px;color:var(--text-muted);margin-left:4px}
    #equipo{background:var(--dark-0)}
    .team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
    .team-card{text-align:center}
    .team-avatar{width:140px;height:140px;border-radius:50%;margin:0 auto 24px;background:var(--dark-3);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:48px}
    .team-name{font-family:var(--ff-display);font-size:26px;font-weight:400;color:var(--cream);margin-bottom:4px}
    .team-role{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
    .team-bio{font-size:12px;color:var(--text-muted);line-height:1.8}
    #reservas{background:var(--dark-1)}
    .reservas-layout{display:grid;grid-template-columns:1fr 1.4fr;gap:80px;align-items:start}
    .reservas-info h2{font-size:clamp(38px,4vw,60px);color:var(--cream);margin:16px 0 24px;line-height:1.1}
    .reservas-info p{font-size:13px;font-weight:200;color:var(--text-muted);line-height:2;margin-bottom:40px}
    .contact-items{display:flex;flex-direction:column;gap:20px}
    .contact-item{display:flex;align-items:center;gap:16px;font-size:12px;font-weight:200;letter-spacing:1px;color:var(--cream-dim)}
    .contact-icon{width:36px;height:36px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
    .booking-form{background:var(--dark-2);border:1px solid var(--border-subtle);padding:50px;position:relative}
    .booking-form::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(to right,transparent,var(--gold),transparent)}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:20px}
    .form-group{margin-bottom:24px}
    .form-group label{display:block;font-size:9px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
    .form-group input,.form-group select,.form-group textarea{width:100%;background:var(--dark-3);border:1px solid var(--border-subtle);border-bottom:1px solid var(--border);color:var(--cream);font-family:var(--ff-sans);font-size:13px;font-weight:200;letter-spacing:1px;padding:14px 16px;outline:none;transition:var(--t);-webkit-appearance:none;appearance:none}
    .form-group select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a84c' stroke-width='1.5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;cursor:pointer}
    .form-group select option{background:var(--dark-3)}
    .form-group textarea{resize:vertical;min-height:90px}
    .form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--gold-dim);background:var(--dark-4);box-shadow:0 0 0 1px rgba(201,168,76,0.1)}
    .form-group input::placeholder,.form-group textarea::placeholder{color:var(--text-faint)}
    .btn-submit{width:100%;padding:18px;background:transparent;border:1px solid var(--gold);color:var(--gold);font-family:var(--ff-sans);font-size:11px;font-weight:300;letter-spacing:5px;text-transform:uppercase;cursor:pointer;transition:var(--t);position:relative;overflow:hidden}
    .btn-submit::before{content:'';position:absolute;top:0;left:0;width:0%;height:100%;background:var(--gold);transition:width 0.4s;z-index:0}
    .btn-submit span{position:relative;z-index:1;transition:color 0.4s}
    .btn-submit:hover::before{width:100%} .btn-submit:hover span{color:var(--dark-0)}
    .btn-submit:disabled{opacity:0.5;cursor:not-allowed}
    #form-message{margin-top:20px;padding:16px 20px;font-size:12px;font-weight:200;letter-spacing:1px;border-left:2px solid;display:none}
    #form-message.success{display:block;color:#7bc97b;border-color:#7bc97b;background:rgba(123,201,123,0.05)}
    #form-message.error{display:block;color:#e07070;border-color:#e07070;background:rgba(224,112,112,0.05)}
    footer{background:var(--dark-2);border-top:1px solid var(--border-subtle);padding:60px 0 30px}
    .footer-inner{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:60px;margin-bottom:50px}
    .footer-brand-name{font-family:var(--ff-display);font-size:28px;letter-spacing:2px;color:var(--cream);margin-bottom:8px}
    .footer-brand-name span{color:var(--gold)}
    .footer-brand-tag{font-size:9px;letter-spacing:4px;color:var(--gold-dim);text-transform:uppercase;margin-bottom:20px}
    .footer-brand-desc{font-size:12px;font-weight:200;color:var(--text-faint);line-height:1.9}
    .footer-col h4{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--gold);margin-bottom:20px}
    .footer-col ul{list-style:none} .footer-col ul li{margin-bottom:10px}
    .footer-col ul a{font-size:12px;font-weight:200;color:var(--text-faint);text-decoration:none;letter-spacing:1px;transition:color 0.3s}
    .footer-col ul a:hover{color:var(--cream-dim)}
    .footer-col p{font-size:12px;font-weight:200;color:var(--text-faint);margin-bottom:8px}
    .footer-bottom{padding-top:30px;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center}
    .footer-copy{font-size:10px;color:var(--text-faint);letter-spacing:2px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    .reveal{opacity:0;transform:translateY(32px);transition:opacity 0.7s ease,transform 0.7s ease}
    .reveal.visible{opacity:1;transform:translateY(0)}
    @media(max-width:900px){
      .container{padding:0 24px} .nav-links{display:none}
      .services-grid{grid-template-columns:1fr} .team-grid{grid-template-columns:1fr 1fr;gap:30px}
      .reservas-layout{grid-template-columns:1fr;gap:50px} .footer-inner{grid-template-columns:1fr;gap:40px}
      .stats-inner{grid-template-columns:repeat(2,1fr)} .form-row{grid-template-columns:1fr}
    }
    @media(max-width:600px){
      section{padding:80px 0} .booking-form{padding:30px 24px}
      .team-grid{grid-template-columns:1fr} .footer-bottom{flex-direction:column;gap:12px;text-align:center}
    }
  </style>
</head>
<body>

<nav>
  <div class="nav-inner">
    <a href="#" class="nav-logo">BARBER <span>&</span> CO.</a>
    <ul class="nav-links">
      <li><a href="#servicios">Servicios</a></li>
      <li><a href="#equipo">Equipo</a></li>
      <li><a href="#reservas">Reservas</a></li>
      <li><a href="#reservas" class="nav-cta">Reservar</a></li>
    </ul>
  </div>
</nav>

<section id="hero">
  <div class="hero-bg"></div>
  <div class="hero-lines"></div>
  <div class="hero-content">
    <p class="hero-est">Est. 2018 · Santiago, Chile</p>
    <h1 class="hero-title">The <em>Art</em></h1>
    <h2 class="hero-subtitle">of Grooming.</h2>
    <p class="hero-desc">Donde la tradición del barbero clásico se encuentra con la elegancia moderna. Cada visita, una experiencia.</p>
    <div class="hero-actions">
      <a href="#reservas" class="btn-primary">Reservar Ahora</a>
      <a href="#servicios" class="btn-secondary">Ver Servicios</a>
    </div>
  </div>
</section>

<div id="stats">
  <div class="stats-inner">
    <div class="stat-item reveal"><span class="stat-number" data-count="2800">0</span><span class="stat-label">Clientes Satisfechos</span></div>
    <div class="stat-item reveal"><span class="stat-number" data-count="6">0</span><span class="stat-label">Años de Experiencia</span></div>
    <div class="stat-item reveal"><span class="stat-number" data-count="3">0</span><span class="stat-label">Maestros Barberos</span></div>
    <div class="stat-item reveal"><span class="stat-number" data-count="7">0</span><span class="stat-label">Servicios Premium</span></div>
  </div>
</div>

<section id="servicios">
  <div class="container">
    <div class="section-header reveal">
      <p class="label">Lo que ofrecemos</p>
      <div class="divider" style="margin:16px auto"></div>
      <h2 class="section-title">Nuestros Servicios</h2>
      <p class="section-desc">Cada servicio ejecutado con precisión artesanal y los mejores productos del mercado.</p>
    </div>
    <div class="services-grid">
      <div class="service-card reveal"><span class="service-icon">✂️</span><h3 class="service-name">Corte de Cabello</h3><p class="service-desc">Corte personalizado adaptado a tu estructura facial y estilo de vida. Incluye lavado y secado.</p><div class="service-price">$15.000 <span>CLP</span></div></div>
      <div class="service-card reveal"><span class="service-icon">🪒</span><h3 class="service-name">Corte + Barba</h3><p class="service-desc">La combinación perfecta. Corte preciso más diseño y perfilado de barba con navaja recta.</p><div class="service-price">$22.000 <span>CLP</span></div></div>
      <div class="service-card reveal"><span class="service-icon">🌿</span><h3 class="service-name">Arreglo de Barba</h3><p class="service-desc">Perfilado, diseño y tratamiento de barba con aceites naturales y técnica de navaja.</p><div class="service-price">$12.000 <span>CLP</span></div></div>
      <div class="service-card reveal"><span class="service-icon">💈</span><h3 class="service-name">Afeitado Clásico</h3><p class="service-desc">Experiencia tradicional con toalla caliente, crema artesanal y navaja de acero inoxidable.</p><div class="service-price">$18.000 <span>CLP</span></div></div>
      <div class="service-card reveal"><span class="service-icon">🎨</span><h3 class="service-name">Coloración</h3><p class="service-desc">Coloración profesional, mechas o decoloración. Consultamos antes del servicio sin costo.</p><div class="service-price">$35.000 <span>CLP</span></div></div>
      <div class="service-card reveal"><span class="service-icon">👑</span><h3 class="service-name">Combo Completo</h3><p class="service-desc">Corte + barba + afeitado + tratamiento capilar. La experiencia Barber & Co. completa.</p><div class="service-price">$45.000 <span>CLP</span></div></div>
    </div>
  </div>
</section>

<section id="equipo">
  <div class="container">
    <div class="section-header reveal">
      <p class="label">Quienes somos</p>
      <div class="divider" style="margin:16px auto"></div>
      <h2 class="section-title">Nuestro Equipo</h2>
      <p class="section-desc">Maestros barberos con años de experiencia y pasión por el oficio.</p>
    </div>
    <div class="team-grid">
      <div class="team-card reveal"><div class="team-avatar">👨‍🦱</div><h3 class="team-name">Rodrigo Vega</h3><p class="team-role">Fundador & Master Barber</p><p class="team-bio">15 años perfeccionando el arte del corte clásico. Especialista en degradados y estilos vintage.</p></div>
      <div class="team-card reveal"><div class="team-avatar">👨‍🦲</div><h3 class="team-name">Felipe Mora</h3><p class="team-role">Barber & Color Specialist</p><p class="team-bio">Experto en coloración masculina y técnicas modernas. Transforma tendencias en estilos únicos.</p></div>
      <div class="team-card reveal"><div class="team-avatar">🧔</div><h3 class="team-name">Sebastián Cruz</h3><p class="team-role">Beard Specialist</p><p class="team-bio">El maestro de las barbas. Desde diseños precisos hasta el afeitado clásico con toalla caliente.</p></div>
    </div>
  </div>
</section>

<section id="reservas">
  <div class="container">
    <div class="reservas-layout">
      <div class="reservas-info">
        <p class="label">Agenda tu visita</p>
        <div class="h-divider" style="margin:16px 0"></div>
        <h2>Reserva<br><em style="font-style:italic;color:var(--gold)">tu hora</em></h2>
        <p>Asegura tu lugar con anticipación. Tras tu reserva, recibirás un correo de confirmación con todos los detalles.</p>
        <div class="contact-items">
          <div class="contact-item"><span class="contact-icon">📍</span><span>Av. Providencia 1234, Santiago</span></div>
          <div class="contact-item"><span class="contact-icon">🕐</span><span>Lun–Vie: 10:00–20:00 · Sáb: 10:00–17:00</span></div>
          <div class="contact-item"><span class="contact-icon">📞</span><span>+56 9 1234 5678</span></div>
          <div class="contact-item"><span class="contact-icon">✉️</span><span>contacto@barberandco.cl</span></div>
        </div>
      </div>
      <div class="booking-form reveal">
        <form id="booking-form" novalidate>
          <div class="form-row">
            <div class="form-group"><label for="nombre">Nombre Completo *</label><input type="text" id="nombre" name="nombre" placeholder="Juan Pérez" required></div>
            <div class="form-group"><label for="email">Correo Electrónico *</label><input type="email" id="email" name="email" placeholder="juan@ejemplo.com" required></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label for="telefono">Teléfono *</label><input type="tel" id="telefono" name="telefono" placeholder="+56 9 1234 5678" required></div>
            <div class="form-group">
              <label for="servicio">Servicio *</label>
              <select id="servicio" name="servicio" required>
                <option value="" disabled selected>Selecciona un servicio</option>
                <option value="corte">Corte de Cabello — $15.000</option>
                <option value="corte_barba">Corte + Barba — $22.000</option>
                <option value="barba">Arreglo de Barba — $12.000</option>
                <option value="afeitado">Afeitado Clásico — $18.000</option>
                <option value="coloracion">Coloración — $35.000</option>
                <option value="tratamiento">Tratamiento Capilar — $20.000</option>
                <option value="combo_completo">Combo Completo — $45.000</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label for="fecha">Fecha *</label><input type="date" id="fecha" name="fecha" required></div>
            <div class="form-group">
              <label for="hora">Hora *</label>
              <select id="hora" name="hora" required>
                <option value="" disabled selected>Selecciona una hora</option>
                <option value="10:00">10:00 AM</option><option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option><option value="11:30">11:30 AM</option>
                <option value="12:00">12:00 PM</option><option value="12:30">12:30 PM</option>
                <option value="13:00">13:00 PM</option><option value="13:30">13:30 PM</option>
                <option value="14:00">14:00 PM</option><option value="15:00">15:00 PM</option>
                <option value="15:30">15:30 PM</option><option value="16:00">16:00 PM</option>
                <option value="16:30">16:30 PM</option><option value="17:00">17:00 PM</option>
                <option value="17:30">17:30 PM</option><option value="18:00">18:00 PM</option>
                <option value="18:30">18:30 PM</option><option value="19:00">19:00 PM</option>
                <option value="19:30">19:30 PM</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label for="comentarios">Comentarios o Preferencias</label><textarea id="comentarios" name="comentarios" placeholder="Ej: Prefiero degradado bajo, alergia a ciertos productos..."></textarea></div>
          <button type="submit" class="btn-submit" id="submit-btn"><span>Confirmar Reserva</span></button>
          <div id="form-message" role="alert"></div>
        </form>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="container">
    <div class="footer-inner">
      <div>
        <div class="footer-brand-name">BARBER <span>&</span> CO.</div>
        <div class="footer-brand-tag">The Art of Grooming</div>
        <p class="footer-brand-desc">Desde 2018 ofreciendo la mejor experiencia de barbería premium en Santiago. Tradición, calidad y estilo en cada visita.</p>
      </div>
      <div class="footer-col">
        <h4>Servicios</h4>
        <ul>
          <li><a href="#servicios">Corte de Cabello</a></li>
          <li><a href="#servicios">Corte + Barba</a></li>
          <li><a href="#servicios">Afeitado Clásico</a></li>
          <li><a href="#servicios">Coloración</a></li>
          <li><a href="#servicios">Combo Completo</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contacto</h4>
        <p>📍 Av. Providencia 1234</p>
        <p>📞 +56 9 1234 5678</p>
        <p>✉️ contacto@barberandco.cl</p>
        <br>
        <h4>Horario</h4>
        <p>Lunes – Viernes: 10:00–20:00</p>
        <p>Sábado: 10:00–17:00</p>
        <p>Domingo: Cerrado</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">© 2024 Barber & Co. — Todos los derechos reservados.</p>
      <p class="footer-copy">Santiago, Chile</p>
    </div>
  </div>
</footer>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('visible'), i * 80); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const dateInput = document.getElementById('fecha');
  if (dateInput) { dateInput.min = new Date().toISOString().split('T')[0]; }

  const form = document.getElementById('booking-form');
  const submitBtn = document.getElementById('submit-btn');
  const messageEl = document.getElementById('form-message');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        nombre: form.nombre.value.trim(), email: form.email.value.trim(),
        telefono: form.telefono.value.trim(), servicio: form.servicio.value,
        fecha: formatDate(form.fecha.value), hora: form.hora.value,
        comentarios: form.comentarios.value.trim(),
      };
      if (!formData.nombre || !formData.email || !formData.telefono || !formData.servicio || !formData.fecha || !formData.hora) {
        showMessage('Por favor completa todos los campos obligatorios.', 'error'); return;
      }
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Procesando...';
      messageEl.className = ''; messageEl.style.display = 'none';
      try {
        const response = await fetch('/api/reservar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        const data = await response.json();
        if (data.success) { showMessage('✓ ' + data.message, 'success'); form.reset(); messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
        else { showMessage(data.message || 'Ocurrió un error. Intenta nuevamente.', 'error'); }
      } catch (err) { showMessage('Error de conexión. Intenta nuevamente.', 'error'); }
      finally { submitBtn.disabled = false; submitBtn.querySelector('span').textContent = 'Confirmar Reserva'; }
    });
  }

  function showMessage(text, type) { messageEl.textContent = text; messageEl.className = type; }
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return parseInt(day) + ' de ' + months[parseInt(month)-1] + ' de ' + year;
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target; const target = parseInt(el.dataset.count);
      let current = 0; const step = target / (2000 / 16);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target.toLocaleString('es-CL'); clearInterval(timer); }
        else { el.textContent = Math.floor(current).toLocaleString('es-CL'); }
      }, 16);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
});
</script>
</body>
</html>`;

// ══════════════════════════════════════════════════
//  Nodemailer
// ══════════════════════════════════════════════════
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: false }
  });
}

function generarCorreo({ nombre, email, telefono, servicio, fecha, hora, comentarios }) {
  const map = { corte:'Corte de Cabello', corte_barba:'Corte + Barba', barba:'Arreglo de Barba', afeitado:'Afeitado Clásico', coloracion:'Coloración', tratamiento:'Tratamiento Capilar', combo_completo:'Combo Completo' };
  const svc = map[servicio] || servicio;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="background:#111;border-top:3px solid #c9a84c;padding:40px 30px 30px;">
        <p style="margin:0;color:#c9a84c;letter-spacing:8px;font-size:11px;text-transform:uppercase;font-family:Arial,sans-serif;">Est. 2018</p>
        <h1 style="margin:10px 0 5px;color:#f5f0e8;font-size:36px;letter-spacing:4px;font-family:Georgia,serif;">BARBER & CO.</h1>
        <p style="margin:0;color:#888;letter-spacing:3px;font-size:10px;text-transform:uppercase;font-family:Arial,sans-serif;">The Art of Grooming</p>
      </td></tr>
      <tr><td style="background:#161616;padding:40px;">
        <h2 style="color:#c9a84c;font-size:14px;letter-spacing:5px;text-transform:uppercase;margin:0 0 20px;font-family:Arial,sans-serif;">Reserva Confirmada</h2>
        <p style="color:#d4c9b0;font-size:16px;line-height:1.8;margin:0 0 15px;">Estimado/a <strong style="color:#f5f0e8;">${nombre}</strong>,</p>
        <p style="color:#999;font-size:14px;line-height:1.8;margin:0 0 30px;">Tu reserva ha sido confirmada. Te esperamos con todo nuestro equipo listo para brindarte la mejor experiencia.</p>
        <table width="100%" style="border:1px solid #2a2a2a;border-top:2px solid #c9a84c;">
          <tr><td style="padding:20px 25px;border-bottom:1px solid #2a2a2a;">
            <p style="margin:0;color:#666;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Servicio</p>
            <p style="margin:5px 0 0;color:#f5f0e8;font-size:16px;">${svc}</p>
          </td></tr>
          <tr><td style="padding:20px 25px;border-bottom:1px solid #2a2a2a;">
            <table width="100%"><tr>
              <td width="50%"><p style="margin:0;color:#666;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Fecha</p><p style="margin:5px 0 0;color:#f5f0e8;font-size:16px;">${fecha}</p></td>
              <td width="50%"><p style="margin:0;color:#666;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Hora</p><p style="margin:5px 0 0;color:#f5f0e8;font-size:16px;">${hora}</p></td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:20px 25px;">
            <p style="margin:0;color:#666;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Teléfono</p>
            <p style="margin:5px 0 0;color:#f5f0e8;font-size:16px;">${telefono}</p>
          </td></tr>
          ${comentarios ? '<tr><td style="padding:20px 25px;border-top:1px solid #2a2a2a;"><p style="margin:0;color:#666;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Comentarios</p><p style="margin:5px 0 0;color:#d4c9b0;font-size:14px;">' + comentarios + '</p></td></tr>' : ''}
        </table>
        <p style="margin:30px 0 0;color:#666;font-size:12px;text-align:center;">¿Necesitas cancelar? Contáctanos 24h antes · 📞 +56 9 1234 5678</p>
      </td></tr>
      <tr><td align="center" style="background:#0a0a0a;padding:25px;"><p style="margin:0;color:#444;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Barber & Co. · Santiago, Chile</p></td></tr>
    </table></td></tr>
  </table></body></html>`;
}

// ══════════════════════════════════════════════════
//  Rutas
// ══════════════════════════════════════════════════
app.get('/', (req, res) => res.send(HTML));

app.post('/api/reservar', async (req, res) => {
  const { nombre, email, telefono, servicio, fecha, hora, comentarios } = req.body;

  console.log('📩 Nueva solicitud de reserva:', { nombre, email, servicio, fecha, hora });

  if (!nombre || !email || !telefono || !servicio || !fecha || !hora) {
    return res.status(400).json({ success: false, message: 'Por favor completa todos los campos obligatorios.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'El formato del correo no es válido.' });
  }

  // Log del estado de las variables de entorno (sin mostrar la contraseña)
  console.log('🔧 Config SMTP:', {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || '(no definido)',
    pass: process.env.SMTP_PASS ? '(definido, ' + process.env.SMTP_PASS.length + ' caracteres)' : '(no definido)'
  });

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('⚠️  SMTP_USER o SMTP_PASS no están definidos — modo demo');
    return res.json({ success: true, message: `¡Reserva registrada, ${nombre}! (Modo demo: configura SMTP_USER y SMTP_PASS para enviar correos)` });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    console.log('🔌 Verificando conexión SMTP...');
    await transporter.verify();
    console.log('✅ Conexión SMTP OK');

    console.log(`📧 Enviando correo al cliente: ${email}`);
    await transporter.sendMail({
      from: `"Barber & Co." <${process.env.SMTP_USER}>`,
      to: email,
      subject: `✅ Reserva Confirmada — ${fecha} a las ${hora} | Barber & Co.`,
      html: generarCorreo({ nombre, email, telefono, servicio, fecha, hora, comentarios })
    });
    console.log('✅ Correo al cliente enviado');

    console.log(`📧 Enviando notificación interna a: ${process.env.SMTP_USER}`);
    await transporter.sendMail({
      from: `"Sistema Reservas" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `🔔 Nueva Reserva: ${nombre} — ${fecha} ${hora}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
          <h2 style="color:#c9a84c;border-bottom:2px solid #c9a84c;padding-bottom:10px;">🔔 Nueva Reserva Recibida</h2>
          <p><b>Cliente:</b> ${nombre}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Teléfono:</b> ${telefono}</p>
          <p><b>Servicio:</b> ${servicio}</p>
          <p><b>Fecha:</b> ${fecha}</p>
          <p><b>Hora:</b> ${hora}</p>
          <p><b>Comentarios:</b> ${comentarios || 'Ninguno'}</p>
        </div>
      `
    });
    console.log('✅ Notificación interna enviada');

    res.json({ success: true, message: `¡Reserva confirmada, ${nombre}! Te enviamos un correo de confirmación a ${email}.` });

  } catch (error) {
    console.error('❌ Error completo:', error);
    console.error('❌ Código de error:', error.code);
    console.error('❌ Mensaje:', error.message);

    let mensajeUsuario = 'Hubo un error al enviar el correo de confirmación.';
    if (error.code === 'EAUTH') mensajeUsuario = 'Error de autenticación SMTP. Verifica tu usuario y contraseña de aplicación.';
    if (error.code === 'ECONNECTION') mensajeUsuario = 'No se pudo conectar al servidor de correo.';
    if (error.code === 'ETIMEDOUT') mensajeUsuario = 'Tiempo de conexión agotado al servidor de correo.';

    res.status(500).json({ success: false, message: mensajeUsuario + ' Contáctanos directamente.' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log('\n  ╔═══════════════════════════════════╗');
  console.log('  ║       BARBER & CO. — SERVER       ║');
  console.log('  ╚═══════════════════════════════════╝');
  console.log(`  🚀 http://localhost:${PORT}`);
  console.log(`  📧 SMTP: ${process.env.SMTP_USER ? '✅ Configurado' : '⚠️  No configurado (modo demo)'}\n`);
});
