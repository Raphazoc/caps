// --- Navigation Logic with Scroll Spy ---

// 1. Mobile Menu Toggle
const btn = document.getElementById("mobile-menu-btn");
const menu = document.getElementById("mobile-menu");

if (btn && menu) {
	btn.addEventListener("click", () => {
		menu.classList.toggle("hidden");
	});
}

// 2. Click Scrolling
function scrollToSection(id) {
	const element = document.getElementById(id);
	if (!element) return;
	
	// Close mobile menu if open
	if (menu && !menu.classList.contains("hidden")) {
		menu.classList.add("hidden");
	}

	const offset = 80;
	const bodyRect = document.body.getBoundingClientRect().top;
	const elementRect = element.getBoundingClientRect().top;
	const elementPosition = elementRect - bodyRect;
	const offsetPosition = elementPosition - offset;

	window.scrollTo({
		top: offsetPosition,
		behavior: "smooth"
	});
}

// 3. Scroll Spy (Updates Nav based on scroll position)
document.addEventListener("DOMContentLoaded", () => {
	const sections = document.querySelectorAll("section");
	const navLinks = document.querySelectorAll(".nav-btn");
	const mobileNavLinks = document.querySelectorAll(".mobile-nav-btn");

	const observerOptions = {
		threshold: 0.3 // Trigger when 30% of section is visible
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const id = entry.target.getAttribute("id");
				
				// Update Desktop Nav
				navLinks.forEach((link) => {
					link.classList.remove("nav-active");
					if (link.getAttribute("id") === `nav-${id}`) {
						link.classList.add("nav-active");
					}
				});

				// Update Mobile Nav
				mobileNavLinks.forEach((link) => {
					link.classList.remove("mobile-nav-active");
					if (link.getAttribute("id") === `mob-nav-${id}`) {
						link.classList.add("mobile-nav-active");
					}
				});
			}
		});
	}, observerOptions);

	sections.forEach((section) => {
		observer.observe(section);
	});

	// Add click handlers for nav buttons (desktop & mobile) - separation of concerns
	navLinks.forEach((link) => {
		const target = link.dataset.target;
		if (target) {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				scrollToSection(target);
			});
		}
	});

	mobileNavLinks.forEach((link) => {
		const target = link.dataset.target;
		if (target) {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				// Close mobile menu
				if (menu && !menu.classList.contains('hidden')) menu.classList.add('hidden');
				scrollToSection(target);
			});
		}
	});

	// Attach click listener to search button (removed inline onclick in HTML)
	const searchBtn = document.getElementById('searchBtn');
	if (searchBtn) {
		searchBtn.addEventListener('click', (e) => {
			e.preventDefault();
			simulateSearch();
		});
	}

	// Delegation: tratar cliques em "Solicitar Retirada Física" gerados dinamicamente
	document.addEventListener('click', (e) => {
		const btn = e.target.closest('.request-withdrawal');
		if (!btn) return;
		const name = btn.dataset.name || '';
		alert('Solicitação de retirada enviada para o depósito!' + (name ? ' Paciente: ' + name : ''));
	});

	// --- Enter Key Support for Search ---
	const searchInput = document.getElementById('searchInput');
	if(searchInput) {
		searchInput.addEventListener("keypress", function(event) {
			if (event.key === "Enter") {
				event.preventDefault();
				simulateSearch();
			}
		});
	}
});


// --- Chart Initialization (Chart.js) ---
// Wrapped in try/catch for safety
document.addEventListener("DOMContentLoaded", function() {
	try {
		// Chart 1: Problem Breakdown
		const ctxProblemElement = document.getElementById('problemTypeChart');
		if (ctxProblemElement) {
			const ctxProblem = ctxProblemElement.getContext('2d');
			new Chart(ctxProblem, {
				type: 'doughnut',
				data: {
					labels: ['Problema Logístico', 'Problema Tecnológico'],
					datasets: [{
						data: [90, 10],
						backgroundColor: ['#d97706', '#0d9488'], // Amber-600, Teal-600
						borderWidth: 0
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { position: 'bottom' },
						tooltip: {
							callbacks: {
								label: function(context) {
									return context.label + ': ' + context.raw + '%';
								}
							}
						}
					}
				}
			});
		}

		// Chart 2: Time Comparison
		const ctxTimeElement = document.getElementById('timeComparisonChart');
		if (ctxTimeElement) {
			const ctxTime = ctxTimeElement.getContext('2d');
			new Chart(ctxTime, {
				type: 'bar',
				data: {
					labels: ['Busca Manual (Atual)', 'Busca Digital (DPR)'],
					datasets: [{
						label: 'Tempo Médio (minutos)',
						data: [45, 2],
						backgroundColor: ['#ef4444', '#10b981'], // Red-500, Green-500
						borderRadius: 5
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						y: { beginAtZero: true, title: { display: true, text: 'Minutos' } }
					},
					plugins: {
						legend: { display: false }
					}
				}
			});
		}
	} catch (error) {
		console.error("Erro ao carregar gráficos:", error);
	}
});

// --- Interactive Simulator Logic ---
function simulateSearch() {
	const input = document.getElementById('searchInput');
	const loader = document.getElementById('searchLoader');
	const result = document.getElementById('searchResult');

	if (!input || !input.value.trim()) {
		alert('Por favor, digite um ID ou Nome para pesquisar.');
		return;
	}

	// Hide previous result, show loader
	if (result) result.classList.add('hidden');
	if (loader) loader.classList.remove('hidden');

	// helper: gera localização aleatória
	function generateRandomLocation() {
		const shelves = ["A","B","C","D","E","F"];
		const shelf = shelves[Math.floor(Math.random() * shelves.length)];
		const prateleira = Math.floor(Math.random() * 5) + 1; // 1-5
		const caixa = Math.floor(Math.random() * 50) + 1; // 1-50
		return `Estante ${shelf}, Prateleira ${prateleira}, Caixa ${caixa}`;
	}

	// helper: retorna status aleatório
	function generateRandomStatus() {
		const statuses = [
			"Catalogado",
			"Pendente Digitalização",
			"Digitalizado",
			"Em Triagem",
			"Em Migração",
			"Arquivo Externo"
		];
		return statuses[Math.floor(Math.random() * statuses.length)];
	}

	// Simulate network delay
	setTimeout(() => {
		if (loader) loader.classList.add('hidden');
		
		// Populate dummy data - Results Array
		const query = input.value.toLowerCase();
		const mockData = [
			{
				name: "Maria Silva",
				id: "12345-SUS"
			},
			{
				name: "João de Jesus",
				id: "67890-SUS"
			}
		];

		// Filter results based on search query
		const filtered = mockData.filter(p => 
			p.name.toLowerCase().includes(query) || 
			p.id.toLowerCase().includes(query)
		);

		// If no match, show all (or show "não encontrado")
		const toDisplay = filtered.length > 0 ? filtered : mockData;

		// Update result container with random location/status per item
		if (result) {
			result.innerHTML = toDisplay.map((patient, idx) => {
				const location = generateRandomLocation();
				const status = generateRandomStatus();
				// cor do badge conforme status (simples)
				const statusColorClass = status === "Catalogado" || status === "Digitalizado"
					? "text-green-800 bg-green-100"
					: status === "Pendente Digitalização" || status === "Em Triagem"
						? "text-amber-800 bg-amber-100"
						: "text-slate-800 bg-stone-100";

				return `
				<div class="mb-4 pb-4 ${idx < toDisplay.length - 1 ? 'border-b border-stone-200' : ''}">
					<div class="flex justify-between items-start">
						<div>
							<h5 class="font-bold text-teal-800">${patient.name}</h5>
							<p class="text-xs text-slate-500">ID: ${patient.id}</p>
						</div>
						<span class="${statusColorClass} text-xs px-2 py-1 rounded-full font-bold">${status}</span>
					</div>
					<hr class="my-3 border-stone-200">
					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span class="block text-xs text-slate-400 uppercase">Localização Física</span>
							<span class="font-medium text-slate-700">${location}</span>
						</div>
						<div>
							<span class="block text-xs text-slate-400 uppercase">Status Digital</span>
							<span class="font-medium text-amber-600">${status}</span>
						</div>
					</div>
					<div class="mt-3 pt-2 border-t border-stone-200 flex justify-end">
						<button class="text-xs text-blue-600 hover:underline request-withdrawal" data-name="${patient.name}">Solicitar Retirada Física</button>
					</div>
				</div>`;
			}).join('');
			result.classList.remove('hidden');
		}
	}, 1500);
}