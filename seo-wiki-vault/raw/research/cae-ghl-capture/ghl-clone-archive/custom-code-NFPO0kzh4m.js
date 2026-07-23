
    const reviews = [
      { name: "Nicole", age:29, industry:"E-commerce", review:"Before this session, I kept pivoting every few months. After decoding my chart, I realized I was chasing a path that wasn't meant for me. I now run a business that feels effortless and I'm finally seeing consistent income.", stars:5 },
      { name: "Darren", age:34, industry:"Marketing", review:"This gave me more clarity than any coach ever has. I stopped applying for random jobs, and started building a path that fits me exactly.", stars:5 },
      { name: "Amanda", age:27, industry:"Graphic Design", review:"Within a week of applying what I learned, I turned down two bad fit clients and landed one that paid double, because I finally knew what aligned with my energy.", stars:5 },
      { name: "Kelvin", age:32, industry:"Insurance Agent", review:"I always thought I had a 'money block.' Turns out, I just had the wrong timing. Once I saw my chart, I stopped self-sabotaging and became the top sales of the month.", stars:5 },
      { name: "Joanne", age:41, industry:"Healthcare", review:"This wasn't just about business. It helped me fix my focus, plan long-term, and stop feeling like I was behind. I finally feel like I'm building something that lasts.", stars:5 },
      { name: "Joshua", age:36, industry:"Education", review:"My colleague noticed it first 'You're clearer. Sharper.' I'm leading with more confidence because I'm no longer doubting every decision.", stars:5 },
      { name: "Michelle", age:31, industry:"Technology", review:"For years I worked hard but felt stuck. Now I know why. This chart showed me exactly how I'm wired to succeed — and it changed everything.", stars:5 },
      { name: "KS", age:28, industry:"Engineer", review:"After finding my own strengths through the chart, I received a high salary offer from a big company and they wanted me to start immediately. Originally, I thought I'd take a few months to rest but within just 2 weeks, I landed the job with a salary jump from RM4K to RM8K.", stars:5 },
      { name: "Elaine", age:38, industry:"Real Estate", review:"Before this, I was stuck underpaid and overworked. After realigning my timing and energy, I finally dared to ask for what I was worth and got a 40% raise in one shot.", stars:5 },
      { name: "Jason", age:43, industry:"Consulting", review:"At first, I didn't really believe the health warning mentioned in my chart — it felt too 'coincidental.' But just a few weeks later, I was diagnosed with an early-stage condition exactly in the area pointed out. Thanks to that early headsup, I could take action quickly and prevent it from getting worse.", stars:5 }
    ];

    const myLayer1 = document.getElementById("myLayer1");
    const myLayer2 = document.getElementById("myLayer2");
    const carouselContainer = document.querySelector(".carousel-container");
    let animationFrame;
    let isDragging = false;
    let startX;
    let scrollStart1;
    let scrollStart2;

    function shuffleReviews(reviews) {
      return reviews.map(r => ({ ...r, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ sort, ...r }) => r);
    }

    function populateLayer(layer, reviews) {
      layer.innerHTML = '';
      reviews.forEach(review => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="quote-icon">❝</div>
          <p class="quote-text">${review.review}</p>
          <div class="card-footer">
            <div class="avatar">${review.name.charAt(0)}</div>
            <div class="user-info">
              <h3>${review.name}</h3>
              <p class="subtext">${review.age}, ${review.industry}</p>
              <div class="stars">
                ${'<span>⭐</span>'.repeat(review.stars)}
              </div>
            </div>
          </div>
        `;
        layer.appendChild(card);
      });
    }

    populateLayer(myLayer1, shuffleReviews(reviews));
    populateLayer(myLayer2, shuffleReviews(reviews));

    let scrollPosition1 = 0;
    let scrollPosition2 = -150;

    function animate() {
      if (!isDragging) {
        scrollPosition1 -= 0.2;
        scrollPosition2 -= 0.2;

        if (scrollPosition2 <= -myLayer2.scrollWidth / 3) {
          populateLayer(myLayer1, shuffleReviews(reviews));
          populateLayer(myLayer2, shuffleReviews(reviews));
          scrollPosition1 = 0;
          scrollPosition2 = -150;
        }

        myLayer1.style.transform = `translateX(${scrollPosition1}px)`;
        myLayer2.style.transform = `translateX(${scrollPosition2}px)`;
      }
      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    carouselContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      cancelAnimationFrame(animationFrame);
      startX = e.clientX;
      scrollStart1 = scrollPosition1;
      scrollStart2 = scrollPosition2;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const dx = e.clientX - startX;
        scrollPosition1 = scrollStart1 + dx;
        scrollPosition2 = scrollStart2 + dx;
        myLayer1.style.transform = `translateX(${scrollPosition1}px)`;
        myLayer2.style.transform = `translateX(${scrollPosition2}px)`;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        animate();
      }
    });

    carouselContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      cancelAnimationFrame(animationFrame);
      startX = e.touches[0].clientX;
      scrollStart1 = scrollPosition1;
      scrollStart2 = scrollPosition2;
    });

    window.addEventListener('touchmove', (e) => {
      if (isDragging) {
        const dx = e.touches[0].clientX - startX;
        scrollPosition1 = scrollStart1 + dx;
        scrollPosition2 = scrollStart2 + dx;
        myLayer1.style.transform = `translateX(${scrollPosition1}px)`;
        myLayer2.style.transform = `translateX(${scrollPosition2}px)`;
      }
    });

    window.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        animate();
      }
    });

    carouselContainer.addEventListener("mouseenter", () => {
      if (!isDragging) cancelAnimationFrame(animationFrame);
    });

    carouselContainer.addEventListener("mouseleave", () => {
      if (!isDragging) animate();
    });
  