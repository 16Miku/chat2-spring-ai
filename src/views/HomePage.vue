<template>
  <div class="miku-fan-site">
    <nav class="main-nav">
      <div class="nav-container">
        <div class="logo">
          <img src="/images/Miku7.jpg" alt="初音未来" />
          <span>Miku Fan</span>
        </div>
        <ul class="nav-links">
          <li><router-link to="/" class="active">首页</router-link></li>
          <li><router-link to="/gallery">图库</router-link></li>
          <li><router-link to="/music">音乐</router-link></li>
          <li><router-link to="/luotianyi">洛天依</router-link></li>
          <li><router-link to="/chat">AI聊天</router-link></li>
        </ul>
        <div class="burger" @click="toggleNav">
          <div class="line1"></div>
          <div class="line2"></div>
          <div class="line3"></div>
        </div>
      </div>
    </nav>

    <header class="hero">
      <div class="hero-content">
        <h1 class="neon-text">初音ミク</h1>
        <p>世界第一的公主殿下</p>
        <a href="#about" class="btn-primary">了解更多</a>
      </div>
      <div class="music-notes">
        <div class="music-note" style="left: 10%; top: 20%; color: var(--miku-teal);">♪</div>
        <div class="music-note" style="left: 30%; top: 70%; color: var(--miku-teal);">♫</div>
        <div class="music-note" style="left: 70%; top: 40%; color: var(--miku-teal);">♩</div>
        <div class="music-note" style="left: 90%; top: 60%; color: var(--miku-teal);">♬</div>
      </div>
    </header>

    <main>
      <section id="about" class="about-section">
        <div class="container">
          <h2 class="section-title">关于初音未来</h2>
          <div class="about-content">
            <div class="about-text">
              <p>初音未来（初音ミク，Hatsune Miku）是由CRYPTON FUTURE MEDIA开发的虚拟歌手软件，自2007年诞生以来，已成为全球现象级的虚拟偶像和文化符号。</p>
              <p>她拥有标志性的蓝绿色双马尾和甜美的声音，深受世界各地粉丝的喜爱。初音未来不仅是一位歌手，也是一个文化现象，活跃于音乐、游戏、动漫等多个领域。</p>
              <p>她的形象设计由插画家KEI完成，拥有16岁的设定，身高158cm，体重42kg，代表色为蓝绿色(#39c5bb)。</p>
            </div>
            <div class="about-image">
              <img src="/images/Miku4.jpg" alt="初音未来介绍" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section id="image-slider" class="slider-section">
        <div class="container">
          <h2 class="section-title">精美图集</h2>
          <div class="slider-container">
            <div class="slider">
              <img src="/images/Miku1.jpg" alt="初音未来1" class="active" loading="lazy" />
              <img src="/images/Miku2.jpg" alt="初音未来2" loading="lazy" />
              <img src="/images/Miku3.jpg" alt="初音未来3" loading="lazy" />
            </div>
            <div class="slider-controls">
              <button class="prev-btn" @click="prevSlide"><i class="fas fa-chevron-left"></i></button>
              <button class="next-btn" @click="nextSlide"><i class="fas fa-chevron-right"></i></button>
            </div>
          </div>
          <div class="view-more">
            <router-link to="/gallery" class="btn-secondary">查看更多图片</router-link>
          </div>
        </div>
      </section>

      <section id="popular-songs" class="songs-section">
        <div class="container">
          <h2 class="section-title">热门歌曲</h2>
          <div class="songs-grid">
            <div class="song-card">
              <div class="song-image">
                <img src="/images/Miku5.jpg" alt="World is Mine" loading="lazy" />
                <div class="play-button" @click="playSong('World is Mine')">
                  <i class="fas fa-play"></i>
                </div>
              </div>
              <div class="song-info">
                <h3>World is Mine</h3>
                <p>作曲: ryo</p>
              </div>
            </div>

            <div class="song-card">
              <div class="song-image">
                <img src="/images/Miku9.jpg" alt="World is Mine" loading="lazy" />
                <div class="play-button" @click="playSong('World is Mine')">
                  <i class="fas fa-play"></i>
                </div>
              </div>
              <div class="song-info">
                <h3>World is Mine</h3>
                <p>作曲: ryo</p>
              </div>
            </div>

            <div class="song-card">
              <div class="song-image">
                <img src="/images/Miku10.jpg" alt="Melt" loading="lazy" />
                <div class="play-button" @click="playSong('Melt')">
                  <i class="fas fa-play"></i>
                </div>
              </div>
              <div class="song-info">
                <h3>Melt</h3>
                <p>作曲: ryo</p>
              </div>
            </div>
            <div class="song-card">
              <div class="song-image">
                <img src="/images/Miku4.jpg" alt="千本樱" loading="lazy" />
                <div class="play-button" @click="playSong('千本樱')">
                  <i class="fas fa-play"></i>
                </div>
              </div>
              <div class="song-info">
                <h3>千本樱</h3>
                <p>作曲: 黒うさP</p>
              </div>
            </div>
          </div>
          <div class="view-more">
            <router-link to="/music" class="btn-secondary">查看更多歌曲</router-link>
          </div>
        </div>
      </section>

      <section id="video-player" class="video-section">
        <div class="container">
          <h2 class="section-title">精选视频</h2>
          <div class="video-container">
            <video
              ref="mikuVideo"
              class="video-js"
              controls
              preload="auto"
              poster="/images/Miku3.jpg"
              data-setup="{}"
            >
              <source src="/video/1-恋愛裁判-1080P 高清-AV1.mp4" type="video/mp4" />
              <p class="vjs-no-js">
                请启用JavaScript或升级您的浏览器以支持HTML5视频
              </p>
            </video>
          </div>
        </div>
      </section>

      <section id="events" class="events-section">
        <div class="container">
          <h2 class="section-title">最新活动</h2>
          <div class="events-timeline">
            <div class="event-item">
              <div class="event-date">
                <span class="month">八月</span>
                <span class="day">31</span>
              </div>
              <div class="event-content">
                <h3>2024年初音未来线上演唱会</h3>
                <p>全球同步直播，体验前所未有的虚拟演唱会</p>
                <a href="#" class="btn-small">了解详情</a>
              </div>
            </div>
            <div class="event-item">
              <div class="event-date">
                <span class="month">九月</span>
                <span class="day">15</span>
              </div>
              <div class="event-content">
                <h3>初音未来15周年纪念专辑发布</h3>
                <p>收录15首经典歌曲的重制版本</p>
                <a href="#" class="btn-small">预订</a>
              </div>
            </div>
            <div class="event-item">
              <div class="event-date">
                <span class="month">十月</span>
                <span class="day">10</span>
              </div>
              <div class="event-content">
                <h3>初音未来主题展览</h3>
                <p>北京、上海、广州三地巡展</p>
                <a href="#" class="btn-small">购票</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="newsletter" class="newsletter-section">
        <div class="container">
          <h2 class="section-title">订阅最新资讯</h2>
          <p>第一时间获取初音未来的最新消息、活动和周边信息</p>
          <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
            <input type="email" v-model="email" placeholder="请输入您的邮箱" required />
            <button type="submit" class="btn-primary">订阅</button>
          </form>
        </div>
      </section>
    </main>

    <footer class="main-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <img src="/images/Miku7.jpg" alt="初音未来" />
            <span>Miku Fan</span>
          </div>
          <div class="footer-links">
            <h3>快速链接</h3>
            <ul>
              <li><router-link to="/">首页</router-link></li>
              <li><router-link to="/gallery">图库</router-link></li>
              <li><router-link to="/music">音乐</router-link></li>
              <li><router-link to="/luotianyi">洛天依</router-link></li>
              <li><router-link to="/chat">AI聊天</router-link></li>
            </ul>
          </div>
          <div class="footer-social">
            <h3>关注我们</h3>
            <div class="social-icons">
              <a href="#"><i class="fab fa-weibo"></i></a>
              <a href="#"><i class="fab fa-bilibili"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2024 初音未来粉丝站 | 本站仅供粉丝交流，与官方无关</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      currentSlide: 0,
      totalSlides: 3,
      email: '',
      isNavActive: false
    }
  },
  mounted() {
    // 初始化图片轮播
    this.startSlideShow();
    
    // 如果使用 video.js，可以在这里初始化
    if (typeof videojs !== 'undefined' && this.$refs.mikuVideo) {
      videojs(this.$refs.mikuVideo);
    }
  },
  methods: {
    // 导航菜单切换
    toggleNav() {
      this.isNavActive = !this.isNavActive;
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        navLinks.classList.toggle('nav-active', this.isNavActive);
      }
    },
    
    // 图片轮播控制
    startSlideShow() {
      setInterval(() => {
        this.nextSlide();
      }, 5000); // 每5秒切换一次
    },
    
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
      this.updateSlideDisplay();
    },
    
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
      this.updateSlideDisplay();
    },
    
    updateSlideDisplay() {
      const slides = document.querySelectorAll('.slider img');
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === this.currentSlide);
      });
    },
    
    // 播放歌曲
    playSong(songName) {
      // 这里可以实现歌曲播放逻辑
      console.log(`播放歌曲: ${songName}`);
      alert(`正在播放: ${songName}`);
    },
    
    // 订阅处理
    subscribeNewsletter() {
      if (this.email) {
        alert(`感谢订阅！我们会将最新资讯发送到: ${this.email}`);
        this.email = '';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 定义初音未来主题色变量 */
:root {
  --miku-teal: #39c5bb;
  --miku-dark: #2d2d2d;
  --miku-light: #f5f5f5;
}

/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* 导航栏样式 */
.main-nav {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  
  img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  span {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--miku-teal);
  }
}

.nav-links {
  display: flex;
  list-style: none;
  
  li {
    margin-left: 20px;
    
    a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      padding: 5px 10px;
      border-radius: 4px;
      transition: all 0.3s ease;
      
      &:hover, &.active {
        color: var(--miku-teal);
        background-color: rgba(57, 197, 187, 0.1);
      }
    }
  }
}

.burger {
  display: none;
  cursor: pointer;
  
  div {
    width: 25px;
    height: 3px;
    background-color: #333;
    margin: 5px;
    transition: all 0.3s ease;
  }
}

/* 英雄区域样式 */
.hero {
  height: 80vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/Miku5.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  text-align: center;
  color: white;
  z-index: 1;
  
  h1 {
    font-size: 4rem;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 1.5rem;
    margin-bottom: 30px;
  }
}

.neon-text {
  color: #fff;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6, 0 0 25px #0073e6, 0 0 30px #0073e6, 0 0 35px #0073e6;
  animation: neon 1.5s ease-in-out infinite alternate;
}

@keyframes neon {
  from {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6, 0 0 25px #0073e6, 0 0 30px #0073e6, 0 0 35px #0073e6;
  }
  to {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #0073e6, 0 0 40px #0073e6, 0 0 50px #0073e6, 0 0 60px #0073e6, 0 0 70px #0073e6;
  }
}

.music-notes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.music-note {
  position: absolute;
  color: rgba(255, 255, 255, 0.7);
  font-size: 2rem;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

.btn-primary {
  display: inline-block;
  padding: 12px 30px;
  background-color: var(--miku-teal);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: darken(#39c5bb, 10%);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
}

/* 关于部分样式 */
.about-section {
  padding: 80px 0;
  background-color: white;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: var(--miku-teal);
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background-color: var(--miku-teal);
    margin: 15px auto 0;
  }
}

.about-content {
  display: flex;
  align-items: center;
  gap: 40px;
}

.about-text {
  flex: 1;
  
  p {
    margin-bottom: 15px;
    font-size: 1.1rem;
    line-height: 1.8;
  }
}

.about-image {
  flex: 1;
  
  img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
}

/* 图片轮播样式 */
.slider-section {
  padding: 80px 0;
  background-color: #f9f9f9;
}

.slider-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.slider {
  position: relative;
  height: 450px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 1s ease-in-out;
    
    &.active {
      opacity: 1;
    }
  }
}

.slider-controls {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  
  button {
    background-color: rgba(255, 255, 255, 0.7);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: white;
    }
    
    i {
      color: var(--miku-teal);
    }
  }
}

.view-more {
  text-align: center;
  margin-top: 30px;
}

.btn-secondary {
  display: inline-block;
  padding: 10px 25px;
  background-color: transparent;
  color: var(--miku-teal);
  text-decoration: none;
  border: 2px solid var(--miku-teal);
  border-radius: 30px;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--miku-teal);
    color: white;
  }
}

/* 歌曲部分样式 */
.songs-section {
  padding: 80px 0;
  background-color: white;
}

.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.song-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
}

.song-image {
  position: relative;
  height: 200px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background-color: rgba(57, 197, 187, 0.8);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    i {
      color: white;
      font-size: 1.5rem;
    }
  }
  
  &:hover .play-button {
    opacity: 1;
  }
}

.song-info {
  padding: 15px;
  
  h3 {
    margin-bottom: 5px;
    color: #333;
  }
  
  p {
    color: #666;
    font-size: 0.9rem;
  }
}

/* 视频部分样式 */
.video-section {
  padding: 80px 0;
  background-color: #f9f9f9;
}

.video-container {
  max-width: 800px;
  margin: 0 auto;
  
  video {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
}

/* 活动部分样式 */
.events-section {
  padding: 80px 0;
  background-color: white;
}

.events-timeline {
  max-width: 800px;
  margin: 0 auto;
}

.event-item {
  display: flex;
  margin-bottom: 30px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.event-date {
  background-color: var(--miku-teal);
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 100px;
  
  .month {
    font-size: 1rem;
    font-weight: bold;
  }
  
  .day {
    font-size: 2rem;
    font-weight: bold;
  }
}

.event-content {
  padding: 20px;
  flex: 1;
  
  h3 {
    margin-bottom: 10px;
    color: #333;
  }
  
  p {
    margin-bottom: 15px;
    color: #666;
  }
}

.btn-small {
  display: inline-block;
  padding: 8px 15px;
  background-color: var(--miku-teal);
  color: white;
  text-decoration: none;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: darken(#39c5bb, 10%);
  }
}

/* 订阅部分样式 */
.newsletter-section {
  padding: 80px 0;
  background-color: #f9f9f9;
  text-align: center;
  
  p {
    max-width: 600px;
    margin: 0 auto 30px;
    color: #666;
  }
}

.newsletter-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  
  input {
    flex: 1;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 30px 0 0 30px;
    font-size: 1rem;
    outline: none;
    
    &:focus {
      border-color: var(--miku-teal);
    }
  }
  
  button {
    padding: 15px 30px;
    background-color: var(--miku-teal);
    color: white;
    border: none;
    border-radius: 0 30px 30px 0;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: darken(#39c5bb, 10%);
    }
  }
}

/* 页脚样式 */
.main-footer {
  background-color: #333;
  color: white;
  padding: 60px 0 20px;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 40px;
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  span {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--miku-teal);
  }
}

.footer-links, .footer-social {
  margin-bottom: 20px;
  
  h3 {
    color: white;
    margin-bottom: 15px;
    font-size: 1.2rem;
  }
  
  ul {
    list-style: none;
    
    li {
      margin-bottom: 10px;
      
      a {
        color: #ccc;
        text-decoration: none;
        transition: color 0.3s ease;
        
        &:hover {
          color: var(--miku-teal);
        }
      }
    }
  }
}

.social-icons {
  display: flex;
  gap: 15px;
  
  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    

    &:hover {
      background-color: var(--miku-teal);
      transform: translateY(-3px);
    }
  }
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  p {
    color: #999;
    font-size: 0.9rem;
  }
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .nav-links {
    position: absolute;
    right: 0;
    height: 92vh;
    top: 8vh;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    transform: translateX(100%);
    transition: transform 0.5s ease-in;
    z-index: 1;
    
    li {
      opacity: 0;
      margin: 20px 0;
    }
  }
  
  .nav-links.nav-active {
    transform: translateX(0%);
    
    li {
      opacity: 1;
      transition: opacity 0.5s ease 0.3s;
    }
  }
  
  .burger {
    display: block;
  }
  
  .about-content {
    flex-direction: column;
  }
  
  .hero-content h1 {
    font-size: 3rem;
  }
  
  .songs-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
  }
  
  .newsletter-form {
    flex-direction: column;
    
    input {
      border-radius: 30px;
      margin-bottom: 10px;
    }
    
    button {
      border-radius: 30px;
    }
  }
}
</style>