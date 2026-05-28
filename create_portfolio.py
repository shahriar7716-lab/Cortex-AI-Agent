import os

desktop = os.path.join(os.environ['USERPROFILE'], 'Desktop')
portfolio_dir = os.path.join(desktop, 'MyPortfolio')
os.makedirs(portfolio_dir, exist_ok=True)

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shahriar | Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        html { scroll-behavior: smooth; }
    </style>
</head>
<body class="bg-[#0b0f19] text-slate-200 font-sans selection:bg-cyan-500 selection:text-slate-950">
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/80 z-50">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <span class="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SHAHRIAR</span>
            <div class="flex gap-6 text-sm font-medium text-slate-400">
                <a href="#about" class="hover:text-cyan-400 transition">About</a>
                <a href="#skills" class="hover:text-cyan-400 transition">Skills</a>
                <a href="#projects" class="hover:text-cyan-400 transition">Projects</a>
                <a href="#contact" class="hover:text-cyan-400 transition">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="min-h-screen flex items-center justify-center pt-16 px-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.08),transparent_50%)]"></div>
        <div class="max-w-4xl text-center space-y-6 relative z-10">
            <div class="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full text-cyan-400 text-sm font-semibold mb-2">
                <span class="flex h-2 w-2 relative">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Available for Projects
            </div>
            <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight">
                Hi, I'm <span class="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">Shahriar</span>
            </h1>
            <p class="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto">
                An 11-year-old Software Developer & AI Enthusiast building the future of autonomous systems.
            </p>
            <div class="flex justify-center gap-4 pt-4">
                <a href="#projects" class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-lg shadow-cyan-500/20">View My Work</a>
                <a href="#contact" class="border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 px-6 py-3 rounded-lg font-semibold transition duration-300">Get In Touch</a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-24 px-6 bg-[#0d1321]/50 relative">
        <div class="max-w-4xl mx-auto space-y-8">
            <h2 class="text-3xl font-bold border-b border-slate-800/80 pb-4 flex items-center gap-3">
                <i class="fas fa-user text-cyan-500 text-2xl"></i> About Me
            </h2>
            <p class="text-slate-300 leading-relaxed text-lg">
                আমি একজন ১১ বছর বয়সী সফটওয়্যার ডেভেলপার। আমি টাইপস্ক্রিপ্ট, পাইথন এবং এআই এজেন্ট ডেভেলপমেন্ট নিয়ে কাজ করতে ভালোবাসি। আমার সবচেয়ে প্রিয় এবং সফল সৃষ্টি হলো <span class="text-cyan-400 font-semibold">Cortex BY SHAHRIAR</span>, একটি ভয়েস, ভিশন এবং সেলফ-লার্নিং উইন্ডোজ এআই এজেন্ট।
            </p>
        </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="py-24 px-6">
        <div class="max-w-4xl mx-auto space-y-8">
            <h2 class="text-3xl font-bold border-b border-slate-800/80 pb-4 flex items-center gap-3">
                <i class="fas fa-laptop-code text-cyan-500 text-2xl"></i> My Skills
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-[#0d1321] p-6 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition duration-300 text-center group">
                    <i class="fab fa-python text-4xl text-yellow-500 mb-3 group-hover:scale-110 transition duration-300"></i>
                    <h3 class="font-semibold text-slate-200">Python</h3>
                </div>
                <div class="bg-[#0d1321] p-6 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition duration-300 text-center group">
                    <i class="fab fa-js text-4xl text-yellow-400 mb-3 group-hover:scale-110 transition duration-300"></i>
                    <h3 class="font-semibold text-slate-200">TypeScript</h3>
                </div>
                <div class="bg-[#0d1321] p-6 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition duration-300 text-center group">
                    <i class="fab fa-node-js text-4xl text-green-500 mb-3 group-hover:scale-110 transition duration-300"></i>
                    <h3 class="font-semibold text-slate-200">Node.js</h3>
                </div>
                <div class="bg-[#0d1321] p-6 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition duration-300 text-center group">
                    <i class="fas fa-robot text-4xl text-cyan-400 mb-3 group-hover:scale-110 transition duration-300"></i>
                    <h3 class="font-semibold text-slate-200">AI Agents</h3>
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-24 px-6 bg-[#0d1321]/50">
        <div class="max-w-4xl mx-auto space-y-8">
            <h2 class="text-3xl font-bold border-b border-slate-800/80 pb-4 flex items-center gap-3">
                <i class="fas fa-project-diagram text-cyan-500 text-2xl"></i> Projects
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-[#0d1321] p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition duration-300 space-y-4">
                    <div class="text-xs font-semibold text-cyan-400 tracking-wider uppercase">AI Agent</div>
                    <h3 class="text-xl font-bold text-white">Cortex BY SHAHRIAR</h3>
                    <p class="text-slate-400 text-sm">A highly advanced Windows AI Agent equipped with voice recognition, vision capabilities, and self-learning systems.</p>
                </div>
                <div class="bg-[#0d1321] p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition duration-300 space-y-4">
                    <div class="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Utility Skill</div>
                    <h3 class="text-xl font-bold text-white">QR Code Generator</h3>
                    <p class="text-slate-400 text-sm">An integrated AI skill designed to instantly generate QR codes from links, text, or contacts directly inside Cortex.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-24 px-6">
        <div class="max-w-4xl mx-auto text-center space-y-6">
            <h2 class="text-3xl font-bold flex justify-center items-center gap-3">
                <i class="fas fa-envelope text-cyan-500"></i> Let's Connect
            </h2>
            <p class="text-slate-400 max-w-md mx-auto">Feel free to reach out if you want to collaborate on AI projects or software development!</p>
            <div class="flex justify-center gap-6 pt-4 text-2xl text-slate-400">
                <a href="#" class="hover:text-cyan-400 transition duration-300"><i class="fab fa-github"></i></a>
                <a href="#" class="hover:text-cyan-400 transition duration-300"><i class="fab fa-twitter"></i></a>
                <a href="#" class="hover:text-cyan-400 transition duration-300"><i class="fab fa-linkedin"></i></a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-slate-900/80 py-8 text-center text-sm text-slate-500">
        &copy; 2024 Shahriar. Built with Cortex AI.
    </footer>
</body>
</html>"""

with open(os.path.join(portfolio_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(html_content)

import webbrowser
webbrowser.open(os.path.join(portfolio_dir, 'index.html'))
