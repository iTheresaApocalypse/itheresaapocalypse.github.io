---
permalink: /
title: "Kuan Zhang(张宽)"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<div id="about" class="home-section home-about">
  <h2><i class="fas fa-user-circle"></i> About Me</h2>
  <div class="home-about-content">
    <p>I am a Ph.D. Candidate at the <strong>College of AI, Tsinghua University</strong>.</p>
    <p>My research focuses on <strong>general game agents</strong> and <strong>general game world models</strong>. I am now working with <a href="https://yimingli-page.github.io/" target="_blank">Prof. Yiming Li</a> at THUSI-Lab on building agents that can play and reason across diverse games, and I am currently a <strong>Research Intern at miHoYo (HoYoverse)</strong>.</p>
    <p class="home-about-previous"><strong>Previous:</strong> B.Eng. in Software Engineering at Beijing Institute of Technology (BIT); <a href="https://github.com/BIT-DataLab" target="_blank">BIT-DataLab</a> with <a href="https://scholar.google.com/citations?user=qMPFwIUAAAAJ&hl=zh-CN" target="_blank">Prof. Chengliang Chai</a> — label noise learning and pretraining data selection.</p>
    <p>Outside of research, I enjoy esports, AAA games, music, novels, and animation. Proud Master-tier League of Legends player. 🎮</p>
  </div>
  <div class="home-research-interests">
    <span class="interest-tag"><i class="fas fa-gamepad"></i> General Game Agent</span>
    <span class="interest-tag"><i class="fas fa-globe"></i> General Game World Model</span>
  </div>
</div>

<div id="experience" class="home-section home-experience">
  <h2><i class="fas fa-briefcase"></i> Experience</h2>
  <div class="exp-list">

    <div class="exp-card">
      <div class="exp-logo">
        <img src="{{ site.baseurl }}/images/logo-mihoyo.png" alt="miHoYo">
      </div>
      <div class="exp-content">
        <div class="exp-header">
          <h3 class="exp-org">miHoYo (HoYoverse)</h3>
          <span class="exp-date">Mar 2026 – Present</span>
        </div>
        <p class="exp-role">Research Intern</p>
      </div>
    </div>

    <div class="exp-card">
      <div class="exp-logo">
        <img src="{{ site.baseurl }}/images/logo-thu.png" alt="College of AI, Tsinghua University">
      </div>
      <div class="exp-content">
        <div class="exp-header">
          <h3 class="exp-org">College of AI, Tsinghua University</h3>
          <span class="exp-date">2026 – Present</span>
        </div>
        <p class="exp-role">Ph.D. Candidate &nbsp;·&nbsp; <a href="https://github.com/THUSI-Lab" target="_blank">Intern in THUSI-Lab</a></p>
      </div>
    </div>

    <div class="exp-card">
      <div class="exp-logo">
        <img src="{{ site.baseurl }}/images/logo-bit.png" alt="Beijing Institute of Technology">
      </div>
      <div class="exp-content">
        <div class="exp-header">
          <h3 class="exp-org">Beijing Institute of Technology</h3>
          <span class="exp-date">2022 – 2026</span>
        </div>
        <p class="exp-role">B.Eng. in Software Engineering &nbsp;·&nbsp; <a href="https://github.com/BIT-DataLab" target="_blank">Intern in BIT-DataLab</a></p>
      </div>
    </div>

    <div class="exp-card">
      <div class="exp-logo">
        <img src="{{ site.baseurl }}/images/logo-cd7.png" alt="Chengdu No.7 High School">
      </div>
      <div class="exp-content">
        <div class="exp-header">
          <h3 class="exp-org">Chengdu No.7 High School</h3>
          <span class="exp-date">2019 – 2022</span>
        </div>
        <p class="exp-role">High School</p>
      </div>
    </div>

  </div>
</div>

<div id="publications" class="home-section home-publications">
  <h2><i class="fas fa-file-alt"></i> Publications</h2>
  <p class="home-section-subtitle">* denotes equal contribution, † denotes corresponding author</p>

  <div class="home-pub-section--filterable js-pub-filter-root">
    <div class="pub-filter-bar" role="tablist" aria-label="Publication list filter">
      <button type="button" class="pub-filter__btn pub-filter__btn--active" data-pub-filter="all" role="tab" aria-selected="true">All</button>
      <button type="button" class="pub-filter__btn" data-pub-filter="selected" role="tab" aria-selected="false">Selected</button>
    </div>
    <div class="home-pub-list">

    <div class="home-pub-card home-pub-card--new" data-first-author="false">
      <div class="home-pub-header">
        <span class="home-pub-venue">EMNLP 2026 Findings</span>
        <span class="home-pub-year">2026</span>
      </div>
      <h3 class="home-pub-title">
        <a href="https://arxiv.org/abs/2608.29607">SnapBench: Benchmarking Snap-and-Ask Multimodal Retrieval for Mobile Interactions</a>
      </h3>
      <p class="home-pub-authors">Zirong Chen*, Fuda Ye*, <strong>Kuan Zhang</strong>, Enjun Du, Junfu Pu, Xinlei Wang, Xinyu Zuo, Lisheng Duan, Jin Ma, Yongqi Zhang†</p>
      <div class="home-pub-figure">
        <img src="{{ site.baseurl }}/images/snapbench.jpg" alt="SnapBench Paper Figure">
      </div>
      <p class="home-pub-desc">The first paired benchmark for robust snap-and-ask multimodal retrieval, with 1,145 queries and 9,085 gallery items under 53 controlled corruption conditions. Image artifacts substantially degrade retrieval, while coarse user text can drag down joint retrieval; we propose MOOR for reliability-aware modality calibration.</p>
      <div class="home-pub-links">
        <a href="https://arxiv.org/abs/2608.29607" class="home-pub-link home-pub-link--pdf" target="_blank"><i class="fas fa-file-pdf"></i> Paper</a>
        <a href="https://github.com/zrchen03/SnapBench" class="home-pub-link home-pub-link--code" target="_blank"><i class="fab fa-github"></i> Code</a>
        <a href="https://huggingface.co/datasets/yefd/SnapBench" class="home-pub-link home-pub-link--dataset" target="_blank"><i class="fas fa-database"></i> Dataset</a>
      </div>
    </div>

    <div class="home-pub-card home-pub-card--new home-pub-card--first-author" data-first-author="true">
      <div class="home-pub-header">
        <span class="home-pub-venue">ECCV 2026</span>
        <span class="home-pub-year">2026</span>
      </div>
      <h3 class="home-pub-title">
        <a href="https://arxiv.org/abs/2607.13681">Towards Spatial Supersensing in the Wild</a>
      </h3>
      <p class="home-pub-authors">Tianjun Gu*, Tianyu Xin*, <strong>Kuan Zhang</strong>*, Bowen Yang, Kok-Chung Chua, Peize Li, Xinran Zhang, Yupeng Chen, Qiyue Zhao, Qinlei Xie, Jianhang Liu, Yucheng Lu, Yinan Han, Marco Pavone, Yiming Li†</p>
      <div class="home-pub-figure">
        <img src="{{ site.baseurl }}/images/vsi-super-wild.png" alt="VSI-Super-Wild Paper Figure">
      </div>
      <p class="home-pub-desc">VSI-Super-Wild is a benchmark for spatial supersensing built from 442 real-world long-form, in-the-wild videos across 8 scene categories with 6,980 human-verified QA pairs, probing world-state understanding across agent, objects, and environment. Evaluating 13 multimodal models reveals that even strong models fail at coherent world-state tracking over time, exposing four failure modes: spatial collapse, semantic shortcuts, insufficient update, and instance confusion.</p>
      <div class="home-pub-links">
        <a href="https://arxiv.org/abs/2607.13681" class="home-pub-link home-pub-link--pdf" target="_blank"><i class="fas fa-file-pdf"></i> Paper</a>
        <a href="https://vsi-super-wild.github.io/" class="home-pub-link home-pub-link--project" target="_blank"><i class="fas fa-globe"></i> Project</a>
        <a href="https://github.com/THUSI-Lab/VSI-Super-Wild" class="home-pub-link home-pub-link--code" target="_blank"><i class="fab fa-github"></i> Code</a>
        <a href="https://huggingface.co/datasets/THUSI-Lab/VSI-Super-Wild" class="home-pub-link home-pub-link--dataset" target="_blank"><i class="fas fa-database"></i> Dataset</a>
      </div>
    </div>

    <div class="home-pub-card home-pub-card--new home-pub-card--first-author" data-first-author="true">
      <div class="home-pub-header">
        <span class="home-pub-venue home-pub-venue--preprint">arXiv 2026</span>
        <span class="home-pub-year">2026</span>
      </div>
      <h3 class="home-pub-title">
        <a href="https://arxiv.org/abs/2605.09965">Towards Generalist Game Players: An Investigation of Foundation Models in the Game Multiverse</a>
      </h3>
      <p class="home-pub-authors"><strong>Kuan Zhang</strong>*, Dongchen Liu*, Qiyue Zhao*, Tianyu Xin*, Yue Su*, Haisheng Wang, Han Yin, Hongbo Ma, Peize Li, Tianjun Gu, Xiangnan Wu, Xinran Zhang, Yongxuan Li, Zirong Chen, Yiming Li†</p>
      <div class="home-pub-figure">
        <img src="{{ site.baseurl }}/images/game-multiverse.png" alt="Game Multiverse Paper Figure">
      </div>
      <p class="home-pub-desc">A systematic survey tracing the full lifecycle of generalist game players across four interdependent pillars — Dataset, Model, Harness, and Benchmark — and charting a five-level roadmap from single-game mastery toward the ultimate creator stage in the game multiverse.</p>
      <div class="home-pub-links">
        <a href="https://arxiv.org/abs/2605.09965" class="home-pub-link home-pub-link--pdf" target="_blank"><i class="fas fa-file-pdf"></i> Paper</a>
        <a href="https://github.com/THUSI-Lab/Awesome-LFMs-Play-Games" class="home-pub-link home-pub-link--code" target="_blank"><i class="fab fa-github"></i> Code</a>
      </div>
    </div>

    <div class="home-pub-card home-pub-card--new home-pub-card--first-author" data-first-author="true">
      <div class="home-pub-header">
        <span class="home-pub-venue">ICML 2026</span>
        <span class="home-pub-year">2026</span>
      </div>
      <h3 class="home-pub-title">
        <a href="https://arxiv.org/abs/2603.06656">GameVerse: Can Vision-Language Models Learn from Video-based Reflection?</a>
      </h3>
      <p class="home-pub-authors"><strong>Kuan Zhang</strong>*, Dongchen Liu*, Qiyue Zhao, Jinkun Hou, Xinran Zhang, Qinlei Xie, Miao Liu†, Yiming Li†</p>
      <div class="home-pub-figure">
        <img src="{{ site.baseurl }}/images/gameverse.png" alt="GameVerse Paper Figure">
      </div>
      <p class="home-pub-desc">A comprehensive video game benchmark enabling a reflective visual interaction loop for VLMs, with cognitive hierarchical taxonomy spanning 15 globally popular games, dual action space, and milestone evaluation.</p>
      <div class="home-pub-links">
        <a href="https://arxiv.org/abs/2603.06656" class="home-pub-link home-pub-link--pdf" target="_blank"><i class="fas fa-file-pdf"></i> Paper</a>
        <a href="https://gameverse-bench.github.io" class="home-pub-link home-pub-link--project" target="_blank"><i class="fas fa-globe"></i> Project</a>
        <a href="https://github.com/THUSI-Lab/GameVerse" class="home-pub-link home-pub-link--code" target="_blank"><i class="fab fa-github"></i> Code</a>
      </div>
    </div>

    <div class="home-pub-card home-pub-card--first-author" data-first-author="true">
      <div class="home-pub-header">
        <span class="home-pub-venue">NeurIPS 2025 Poster</span>
        <span class="home-pub-year">2025</span>
      </div>
      <h3 class="home-pub-title">
        <a href="https://arxiv.org/abs/2505.00812">Handling Label Noise via Instance-Level Difficulty Modeling and Dynamic Optimization</a>
      </h3>
      <p class="home-pub-authors"><strong>Kuan Zhang</strong>, Chengliang Chai, Jingzhe Xu, Chi Zhang, Han Han, Ye Yuan, Guoren Wang, Lei Cao</p>
      <div class="home-pub-figure">
        <img src="{{ site.baseurl }}/images/noisy-label.png" alt="Label Noise Paper Figure">
      </div>
      <p class="home-pub-desc">An efficient, hyperparameter-free, instance-level optimization framework for label noise in image classification.</p>
      <div class="home-pub-links">
        <a href="https://arxiv.org/abs/2505.00812" class="home-pub-link home-pub-link--pdf" target="_blank"><i class="fas fa-file-pdf"></i> Paper</a>
      </div>
    </div>

    <div class="home-pub-card" data-first-author="false">
      <div class="home-pub-header">
        <span class="home-pub-venue">ICLR 2025 Spotlight</span>
        <span class="home-pub-year">2025</span>
      </div>
      <h3 class="home-pub-title">
        <a href="https://proceedings.iclr.cc/paper_files/paper/2025/hash/b588d9b67932b459ea66ff6e2804c6b3-Abstract-Conference.html">Harnessing Diversity for Important Data Selection in Pretraining Large Language Models</a>
      </h3>
      <p class="home-pub-authors">Chi Zhang*, Huaping Zhong*, <strong>Kuan Zhang</strong>, Chengliang Chai, Rui Wang, Xinlin Zhuang, Tianyi Bai, Qiu Jiantao, Lei Cao, Ju Fan, Ye Yuan, Guoren Wang, Conghui He</p>
      <div class="home-pub-figure">
        <img src="{{ site.baseurl }}/images/harnessing.png" alt="Harnessing Diversity Paper Figure">
      </div>
      <p class="home-pub-desc">Combine multi-arm bandit with influence function to select data for pretraining process of large language models.</p>
      <div class="home-pub-links">
        <a href="https://proceedings.iclr.cc/paper_files/paper/2025/hash/b588d9b67932b459ea66ff6e2804c6b3-Abstract-Conference.html" class="home-pub-link home-pub-link--pdf" target="_blank"><i class="fas fa-file-pdf"></i> Paper</a>
      </div>
    </div>

    </div>
  </div>
</div>

<div class="home-footer-grid">
<div id="service" class="home-section home-service">
  <h2><i class="fas fa-hands-helping"></i> Academic Service</h2>
  <div class="service-list">
    <div class="service-category">
      <h3 class="service-category-title"><i class="fas fa-search"></i> Conference Reviewer</h3>
      <div class="service-items">
        <span class="service-badge service-badge--golden">ICML Golden Reviewer</span>
        <span class="service-badge">NeurIPS</span>
        <span class="service-badge">ICLR</span>
        <span class="service-badge">AAAI</span>
        <span class="service-badge">TMLR</span>
      </div>
    </div>
  </div>
</div>

<div id="contact" class="home-section home-contact">
  <h2><i class="fas fa-envelope"></i> Email</h2>
  <div class="home-about-content">
    <p>I truly believe that great ideas and improvements come from open discussions and debates in academia. If you have any thoughts, disagreements with my work, or fresh ideas you'd like to share, I'd be really grateful to hear from you.</p>
    <p>If you've got any questions about my research, or if you've tried reaching out through GitHub issues and haven't heard back, please don't hesitate to drop me an email. I'm always happy to chat or help out in any way I can.</p>
  </div>
  <div class="contact-emails">
    <a class="contact-email" href="mailto:kuanzhang2004@163.com"><i class="fas fa-paper-plane"></i> kuanzhang2004@163.com</a>
    <a class="contact-email" href="mailto:kuanzhang2004@gmail.com"><i class="fas fa-paper-plane"></i> kuanzhang2004@gmail.com</a>
  </div>
</div>
</div>

{% include pub-filter-script.html %}
