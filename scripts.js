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

	// Simulate network delay
	setTimeout(() => {
		if (loader) loader.classList.add('hidden');
		
		// Populate dummy data
		const query = input.value;
		const nameEl = document.getElementById('resName');
		const idEl = document.getElementById('resId');
		const locEl = document.getElementById('resLoc');

		if (nameEl) nameEl.innerText = isNaN(query) ? "Maria Silva" : "Paciente ID " + query;
		if (idEl) idEl.innerText = "ID: " + (isNaN(query) ? "12345" : query) + "-SUS";
		if (locEl) locEl.innerText = "Estante " + ["A","B","C"][Math.floor(Math.random()*3)] + ", Caixa " + Math.floor(Math.random() * 50);
		
		if (result) result.classList.remove('hidden');
	}, 1500);
}