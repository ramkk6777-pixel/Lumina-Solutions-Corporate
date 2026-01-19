
import { geminiService } from './services/geminiService';
import { SERVICES, TEAM, NAV_ITEMS } from './constants';
import { Message } from './types';

class LuminaApp {
  private appRoot: HTMLElement;
  private isScrolled = false;
  private isMobileMenuOpen = false;
  private isChatOpen = false;
  private chatMessages: Message[] = [
    { 
      role: 'model', 
      text: "Hello! I'm Lumina, your AI consultant. How can I help you today?", 
      timestamp: new Date() 
    }
  ];
  private isChatLoading = false;

  constructor() {
    this.appRoot = document.getElementById('app')!;
    this.render();
    this.initEventListeners();
  }

  private initEventListeners() {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== this.isScrolled) {
        this.isScrolled = scrolled;
        this.updateNavbar();
      }
    });
  }

  private updateNavbar() {
    const nav = document.getElementById('main-nav');
    if (nav) {
      if (this.isScrolled) {
        nav.classList.add('glass-morphism', 'py-3');
        nav.classList.remove('bg-transparent', 'py-6');
      } else {
        nav.classList.remove('glass-morphism', 'py-3');
        nav.classList.add('bg-transparent', 'py-6');
      }
    }
  }

  private toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    if (menu && icon) {
      menu.classList.toggle('hidden', !this.isMobileMenuOpen);
      icon.className = `fas ${this.isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`;
    }
  }

  private toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    const chatWindow = document.getElementById('chat-window');
    const chatBtn = document.getElementById('chat-toggle-btn');
    if (chatWindow && chatBtn) {
      chatWindow.classList.toggle('scale-100', this.isChatOpen);
      chatWindow.classList.toggle('opacity-100', this.isChatOpen);
      chatWindow.classList.toggle('scale-0', !this.isChatOpen);
      chatWindow.classList.toggle('opacity-0', !this.isChatOpen);
      chatWindow.classList.toggle('pointer-events-none', !this.isChatOpen);
      
      chatBtn.innerHTML = `<i class="fas ${this.isChatOpen ? 'fa-times' : 'fa-comment-dots'} text-2xl"></i>`;
      if (this.isChatOpen) {
          const badge = chatBtn.querySelector('.animate-pulse');
          if (badge) badge.remove();
          this.scrollToBottom();
      }
    }
  }

  private async sendMessage() {
    const input = document.getElementById('chat-input') as HTMLInputElement;
    const text = input.value.trim();
    if (!text || this.isChatLoading) return;

    const userMsg: Message = { role: 'user', text, timestamp: new Date() };
    this.chatMessages.push(userMsg);
    input.value = '';
    this.isChatLoading = true;
    this.updateChatUI();

    const history = this.chatMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await geminiService.chat(text, history);
    this.chatMessages.push({ role: 'model', text: responseText, timestamp: new Date() });
    this.isChatLoading = false;
    this.updateChatUI();
  }

  private updateChatUI() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    container.innerHTML = this.chatMessages.map(msg => `
      <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          msg.role === 'user' 
          ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/10' 
          : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
        }">
          ${msg.text}
          <div class="text-[10px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}">
            ${msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    `).join('');

    if (this.isChatLoading) {
      container.innerHTML += `
        <div class="flex justify-start">
          <div class="bg-white px-4 py-3 rounded-2xl border border-slate-200 flex space-x-1">
            <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      `;
    }
    this.scrollToBottom();
  }

  private scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  private render() {
    this.appRoot.innerHTML = `
      <div class="relative antialiased">
        <!-- Navbar -->
        <nav id="main-nav" class="fixed w-full z-50 transition-all duration-300 bg-transparent py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <a href="#home" class="flex items-center space-x-2">
                  <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <i class="fas fa-lightbulb text-white text-xl"></i>
                  </div>
                  <span class="text-2xl font-extrabold tracking-tight text-slate-900">
                    LUMINA<span class="text-blue-600">.</span>
                  </span>
                </a>
              </div>
              <div class="hidden md:flex items-center space-x-8">
                ${NAV_ITEMS.map(item => `
                  <a href="${item.href}" class="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider">${item.label}</a>
                `).join('')}
                <a href="#contact" class="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">Get Started</a>
              </div>
              <div class="md:hidden">
                <button id="menu-toggle" class="text-slate-600 hover:text-blue-600 focus:outline-none">
                  <i id="menu-icon" class="fas fa-bars text-2xl"></i>
                </button>
              </div>
            </div>
          </div>
          <div id="mobile-menu" class="hidden md:hidden absolute top-full left-0 w-full bg-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div class="px-4 pt-2 pb-6 space-y-1 sm:px-3 flex flex-col items-center">
              ${NAV_ITEMS.map(item => `
                <a href="${item.href}" class="mobile-link block w-full text-center px-3 py-4 text-lg font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-100 last:border-0">${item.label}</a>
              `).join('')}
              <a href="#contact" class="mobile-link mt-4 w-full bg-blue-600 text-white px-6 py-4 rounded-xl text-lg font-bold text-center">Contact Us</a>
            </div>
          </div>
        </nav>

        <!-- Hero -->
        <section id="home" class="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50">
          <div class="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 transform origin-top translate-x-32 hidden lg:block"></div>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              <div class="space-y-8 text-center lg:text-left">
                <div>
                  <span class="inline-block py-1 px-4 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">Redefining Innovation</span>
                  <h1 class="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">Architecting the <span class="text-gradient">Future</span> of Intelligence.</h1>
                  <p class="mt-6 text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">We empower visionary companies with cutting-edge AI, robust cloud infrastructure, and custom software solutions.</p>
                </div>
                <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <a href="#services" class="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-1">Explore Services</a>
                  <a href="#about" class="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all">Our Story</a>
                </div>
              </div>
              <div class="relative hidden lg:block">
                <div class="relative z-10 rounded-3xl overflow-hidden shadow-2xl float-anim">
                  <img src="https://picsum.photos/seed/tech/800/600" alt="Tech" class="w-full h-auto object-cover"/>
                  <div class="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Services -->
        <section id="services" class="py-24 bg-white">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-20">
              <h2 class="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">Core Expertise</h2>
              <h3 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Everything you need to scale in the digital age.</h3>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              ${SERVICES.map(service => `
                <div class="group p-8 bg-slate-50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl transition-all duration-300">
                  <div class="w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform">
                    <i class="fas ${service.icon} text-white text-2xl"></i>
                  </div>
                  <h4 class="text-xl font-bold text-slate-900 mb-4">${service.title}</h4>
                  <p class="text-slate-600 leading-relaxed mb-6">${service.description}</p>
                  <a href="#contact" class="text-blue-600 font-bold text-sm inline-flex items-center group-hover:translate-x-1 transition-transform">Learn more <i class="fas fa-arrow-right ml-2"></i></a>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- About/Team -->
        <section id="about" class="py-24 bg-slate-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-16 items-center mb-24">
              <div class="relative">
                 <div class="rounded-3xl overflow-hidden shadow-2xl">
                    <img src="https://picsum.photos/seed/office/800/800" alt="Office" class="w-full h-auto" />
                 </div>
              </div>
              <div>
                <h2 class="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">Our Mission</h2>
                <h3 class="text-4xl font-extrabold text-slate-900 mb-6">Pioneering the next wave of human-AI collaboration.</h3>
                <p class="text-lg text-slate-600 leading-relaxed">We focus on bridging the gap between technological potential and business reality.</p>
              </div>
            </div>
            <div id="team" class="pt-24 text-center">
              <h2 class="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">The Brain Trust</h2>
              <div class="grid md:grid-cols-3 gap-12 mt-12 text-left">
                ${TEAM.map(member => `
                  <div class="group">
                    <div class="relative mb-6 overflow-hidden rounded-3xl">
                      <img src="${member.image}" alt="${member.name}" class="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <h4 class="text-xl font-bold text-slate-900">${member.name}</h4>
                    <p class="text-blue-600 font-bold text-sm mb-3">${member.role}</p>
                    <p class="text-slate-500 text-sm">${member.bio}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </section>

        <!-- Contact -->
        <section id="contact" class="bg-white py-24">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-20">
               <div>
                  <h2 class="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">Get In Touch</h2>
                  <h3 class="text-4xl font-extrabold text-slate-900 mb-8">Let's discuss your next project.</h3>
                  <div class="space-y-6">
                    <div class="flex items-center space-x-4">
                      <i class="fas fa-envelope text-blue-600"></i>
                      <span class="font-bold">hello@lumina-solutions.io</span>
                    </div>
                  </div>
               </div>
               <div class="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-xl">
                 <form class="space-y-4" onsubmit="event.preventDefault()">
                    <input type="text" class="w-full p-3 rounded-xl border border-slate-200" placeholder="Your Name" />
                    <input type="email" class="w-full p-3 rounded-xl border border-slate-200" placeholder="Email" />
                    <textarea class="w-full p-3 rounded-xl border border-slate-200" rows="4" placeholder="Message"></textarea>
                    <button class="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Send Inquiry</button>
                 </form>
               </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="bg-slate-900 text-white py-20 text-center">
          <p>© 2024 Lumina Solutions International. All rights reserved.</p>
        </footer>

        <!-- Chatbot -->
        <button id="chat-toggle-btn" class="fixed bottom-8 right-8 z-[60] w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95">
          <i class="fas fa-comment-dots text-2xl"></i>
          <span class="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 border-2 border-white rounded-full animate-pulse"></span>
        </button>

        <div id="chat-window" class="fixed bottom-28 right-8 z-[60] w-[90vw] sm:w-[400px] h-[600px] max-h-[70vh] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right scale-0 opacity-0 pointer-events-none">
          <div class="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><i class="fas fa-robot"></i></div>
              <div>
                <h4 class="font-bold">Lumina AI</h4>
                <p class="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Online Assistant</p>
              </div>
            </div>
            <button id="close-chat" class="text-slate-400 hover:text-white"><i class="fas fa-chevron-down"></i></button>
          </div>
          <div id="chat-messages" class="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50"></div>
          <div class="p-4 bg-white border-t border-slate-100">
            <div class="relative flex items-center">
              <input id="chat-input" type="text" placeholder="Type your question..." class="w-full pl-4 pr-12 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"/>
              <button id="send-chat" class="absolute right-2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all">
                <i class="fas fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Hook up elements
    document.getElementById('menu-toggle')?.addEventListener('click', () => this.toggleMobileMenu());
    document.getElementById('chat-toggle-btn')?.addEventListener('click', () => this.toggleChat());
    document.getElementById('close-chat')?.addEventListener('click', () => this.toggleChat());
    document.getElementById('send-chat')?.addEventListener('click', () => this.sendMessage());
    document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
        if ((e as KeyboardEvent).key === 'Enter') this.sendMessage();
    });
    
    // Close mobile menu on link clicks
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => this.toggleMobileMenu());
    });

    this.updateChatUI();
  }
}

new LuminaApp();
