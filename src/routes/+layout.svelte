<script lang="ts">
	import '../app.css';
</script>

<div class="layout">
	<header>
		<nav>
			<div class="nav-container">
				<div class="logo">
					<a href="/">Svelte Hierarchical Data Editor</a>
				</div>
				<ul class="nav-links">
					<li><a href="/">Home</a></li>
					<li><a href="/examples">Examples</a></li>
				</ul>
			</div>
		</nav>
	</header>

	<main>
		<slot />
	</main>

	<footer>
		<div class="footer-content">
			<p>
				Svelte Hierarchical Data Editor - A customizable component for editing hierarchical data
			</p>
		</div>
	</footer>
</div>

<style>
	.layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		background-color: #1e40af;
		color: white;
		padding: 1rem 0;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo a {
		color: white;
		font-size: 1.25rem;
		font-weight: bold;
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 1.5rem;
	}

	.nav-links a {
		color: white;
		text-decoration: none;
		font-weight: 500;
		padding: 0.5rem;
		border-radius: 0.25rem;
		transition: background-color 0.2s;
	}

	.nav-links a:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	main {
		flex: 1;
	}

	footer {
		background-color: #f1f5f9;
		padding: 1.5rem 0;
		margin-top: 2rem;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		text-align: center;
		color: #64748b;
	}
</style>
