/*
 * Vanilla Javascript Image Slideshow for Product Images
 * Author: Hannah Beasley
 * Description: Touch-enabled image slideshow, using vanilla Javascript
 * Author URL: https://hannahrosecreative.com
 */

function runThisOnResize( fn, delay ) {
    let throttled = false;
    window.addEventListener('resize', () => {
      // only run if we're not throttled
      if (!throttled) {

        fn();

        // we're throttled!
        throttled = true;
        // set a timeout to un-throttle
        setTimeout( () => {
          throttled = false;
        }, delay);
      }
    });
  }

  // Create functions to control visibility, based on CSS classes
  function transVisibilityIn(element) {
    // Add classes to activate element
    element.classList.add('active');
    setTimeout( function() {
      element.classList.add('visible');
    }, 1);
  }
  function transVisibilityOut(element) {
    element.classList.remove('visible');
    setTimeout( function() {
      element.classList.remove('active');
    }, 250);
  }

class vanillaJSImageSlider {
    constructor( slider ) {
      this.slider = slider;
      this.main = this.slider.querySelector('.product__images--slider-main');
      this.imagesMain = Array.from(this.main.querySelectorAll('.image-container'));
      this.thumbs = this.slider.querySelector('.product__images--thumbs-images');
      this.imageCount = this.imagesMain.length;
      this.navDots = this.slider.querySelector('.product__images--nav.dots ul');
      this.navArrows = this.slider.querySelector('.product__images--nav.arrows ul');
 
      this.productOptions = document.querySelector('.product__option--form');
 
      if( window.innerWidth > 900 ) {
        this.device = 'desktop';
      } else {
        this.device = 'mobile';
      }
 
      this.currentIndex = 0;
      this.currentIndexThumbs = 4;
 
      if ( this.thumbs ) {
        this.thumbsEnabled = true;
        this.imagesThumbs = Array.from(this.thumbs.querySelectorAll('.image-container'));
      } else {
        this.thumbsEnabled = false;
      }
 
      this.mobileBuilt = false;
      this.desktopBuilt = false;
      this.desktopUnbuilt = false;
      this.thumbsBuilt = false;
      this.dotsBuilt = false;
    }
 
    buildSlideshow() {
      // Set up initial slideshow structure based on device type
      if ( this.device === 'desktop' ) {
        this.setupDesktopSlideshow();
      } else if ( this.device === 'mobile' ) {
        this.setupMobileSlideshow();
      }
 
      // Now that the structure is build, show slider and enable functions
      this.showSlider();
      this.enableVariantSelection();
    }
 
    setupDesktopSlideshow() {
      // Make sure we've switched over from mobile if the window has been resized
      if ( !this.desktopBuilt ) {
        if ( this.mobileBuilt ) {
 
          this.unbuildMobile();
          this.mobileBuilt = false;
 
        }
        this.buildDesktop();
        this.desktopBuilt = true;
      }
    }
 
    setupMobileSlideshow() {
      // Make sure we've switched over from desktop if the window has been resized
      if ( !this.mobileBuilt ) {
        if ( this.desktopBuilt ) {
 
          this.unbuildDesktop();
          this.desktopBuilt = false;
 
        }
        this.buildMobile();
        this.mobileBuilt = true;
      }
    }
 
    buildMobile() {
      this.setupMainImagesMobile();
      if ( !this.dotsBuilt ) {
        this.buildDots();
      }
      this.enableDots();
      this.enableTouch();
      this.initializeDots();
    }
 
    buildDesktop() {
      // Determine if we need to handle thumbnails
      if ( this.thumbsEnabled ) {
        this.setupThumbs();
      }
 
      this.setupMainImagesDesktop();
      this.initializeButtons();
    }
 
    unbuildDesktop() {
      // Hide thumbs if they exist
      if ( this.thumbsEnabled ) {
        transVisibilityOut( this.thumbs.parentElement );
        this.thumbs.parentElement.style.display = 'none';
      }
    }
 
    unbuildMobile() {
      // Remove dots
      this.navDots.innerHTML = '';
      this.navDots.style.display = 'none';
      this.dotsBuilt = false;
    }
 
    setupThumbs() {
      this.thumbs.parentElement.style.display = 'block';
      let imageWidth = (this.slider.querySelector('.product__images--slider-thumbs').clientWidth / 4);
      let stripWidth = imageWidth * (this.imageCount + 8);
 
      this.thumbs.style.width = `${ stripWidth }px`;
      this.imagesThumbs.forEach( image => {
        image.style.width = `${ imageWidth }px`;
        image.style.height = `${ imageWidth }px`;
      });
 
      // Register thumbs as built
      this.thumbsBuilt = true;
 
      this.enableThumbs();
 
      // Now that thumbs are set up, make them visible
      transVisibilityIn( this.thumbs.parentElement );
    }
 
    enableThumbs() {
      if ( this.thumbsBuilt ) {
        // Enable clicks on the thumbnails to change the slider
        this.thumbs.addEventListener('click',(e) => {
          if ( e.target.parentElement.classList.contains('image-container') ) {
            let newImage = e.target.parentElement;
            this.currentIndexThumbs = this.imagesThumbs.indexOf( newImage );
 
            // Handle main image infinity
            this.currentIndex = this.currentIndexThumbs - 4;
            this.currentIndex >= this.imageCount - 1 ? this.currentIndex = 0 : this.currentIndex++;
            this.currentIndex <= 0 ? this.currentIndex = this.imageCount - 1 : this.currentIndex--;
 
            this.goToSlide( this.currentIndex, this.currentIndexThumbs );
            this.handleInfinity();
          }
        });
      }
    }
 
    setupMainImagesDesktop() {
      let imageWidth = this.slider.clientWidth - 106;
 
      this.imagesMain.forEach( image => {
        image.style.height = `${ imageWidth }px`;
        image.style.width = `${ imageWidth }px`;
      });
    }
 
    setupMainImagesMobile() {
      let mainStrip = this.slider.querySelector('.product__images--main-images');
      let imageWidth = this.slider.clientWidth - 40;
      let stripWidth = imageWidth * this.imageCount;
      this.imagesMain.forEach( image => {
        image.style.width = `${ imageWidth }px`;
        image.style.height = `${ imageWidth }px`;
      });
 
      mainStrip.style.width = `${ stripWidth }px`;
    }
 
    buildDots() {
      let dots = [];
      let count = 1;
      this.navDots.style.display = 'flex';
 
      this.imagesMain.forEach( image => {
        let dot = document.createElement('li');
        let button = document.createElement('a');
        let buttonDot = document.createElement('span');
        let buttonText = document.createElement('span');
        button.href = '#productImage' + count;
        buttonDot.classList.add('dot');
        buttonText.classList.add('visibility-hidden');
        let buttonTextInner = '';
        if( image.querySelector('img').getAttribute('alt').length > 0 ) {
          buttonTextInner = image.querySelector('img').getAttribute('alt');
        } else {
          buttonTextInner = "{{ 'blogs.wardrobe.dot' | t }} " + count;
        }
        buttonText.innerText = buttonTextInner;
        button.appendChild( buttonText );
        button.appendChild( buttonDot );
        dot.appendChild( button );
        dots.push( dot );
 
        count++;
      });
 
      this.navDots.append( ...dots );
 
      this.dotsBuilt = true;
    }
 
    enableDots() {
      let count = this.navDots.querySelectorAll('li').length;
      let dotWidth = this.navDots.querySelector('li').offsetWidth;
      let dotsStripWidth = count * dotWidth;
      if ( dotsStripWidth > this.navDots.clientWidth ) {
        this.navDots.style.width = `${ count * dotWidth }px`;
      }
 
      this.navDots.parentElement.style.display = 'block';
    }
 
    initializeDots() {
      let dots = Array.from(this.navDots.querySelectorAll('li a'));
      this.navDots.addEventListener('click',(e) => {
        dots.forEach( dot => {
          if ( e.target == dot ) {
            e.preventDefault();
            dot.classList.add('active');
            let slideIndex = dots.indexOf( dot );
            let slideOffset = this.imagesMain[slideIndex].offsetLeft - 20;
            let dotOffset = dot.offsetLeft;
            let dotHalfwayPoint = this.navDots.parentElement.clientWidth / 2;
            let translateValue = (dotOffset - (dot.clientWidth / 1.5)) - dotHalfwayPoint;
            this.main.scroll({
              top: 0,
              left: slideOffset,
              behavior: 'smooth'
            });
            console.log( translateValue * -1 );
            console.log( this.navDots.clientWidth );
            if ( dots.length > 10 ) {
              this.navDots.style.transform = `translateX(-${ translateValue }px)`;
            }
          } else {
            dot.classList.remove('active');
          }
        });
      })
    }
 
    showSlider() {
      this.slider.classList.add('visible');
      this.imagesMain[0].classList.add('is-active');
    }
 
    updateDots( slide ) {
      let dots = Array.from(this.navDots.querySelectorAll('li a'));
      dots.forEach( dot => {
        dot.classList.remove('active');
      })
 
      let indexNum = this.imagesMain.indexOf( slide );
 
      dots[indexNum].classList.add('active');
 
      let dotOffset = dots[indexNum].offsetLeft;
      let dotHalfwayPoint = this.navDots.parentElement.clientWidth / 2;
      let translateValue = (dotOffset - (dots[indexNum].clientWidth / 1.5)) - dotHalfwayPoint;
      if ( dots.length > 10 ) {
        if ( translateValue > 0 ) {
          this.navDots.style.transform = `translateX(-${ translateValue }px)`;
        } else {
          this.navDots.style.transform = `translateX(0)`;
        }
      }
    }
 
    observeSlides( entries, obs ) {
      let slides = this.imagesMain;
      entries.forEach( entry => {
        let slide = entry.target;
        if (!entry.isIntersecting) {
          //slide.classList.remove('active');
          return;
        }
        slides.forEach( thumb => {
          thumb.classList.remove('active');
        })
        slide.classList.add('active');
        if( this.device === 'mobile' ) {
          this.updateDots( slide );
        }
      });
    }
 
    enableTouch() {
      let dots = this.navDots.querySelectorAll('li');
      let boundObserveSlides = this.observeSlides.bind(this);
 
      let options = {
        root: this.slider,
        rootMargin: '0px',
        threshold: .5
      }
      let observer = new IntersectionObserver(boundObserveSlides, options);
 
      this.imagesMain.forEach( dot => {
        observer.observe( dot );
     } );
    }
 
    initializeButtons() {
      let next = this.navArrows.querySelector('.product__images--nav-next');
      let prev = this.navArrows.querySelector('.product__images--nav-prev');
      let theImageCountIndex = this.imageCount - 1;
      // Add one event listener, then determine which button is being clicked
      this.navArrows.addEventListener('click', ( e ) => {
        let clicked = e.target;
 
        // Adjust count based on which button is clicked
        if( clicked === next ) {
           // Handle infinity right here for main images
           this.currentIndex === this.imageCount - 1 ? this.currentIndex = 0 : this.currentIndex++;
           // Infinity for thumbs will be handled further down
           this.currentIndexThumbs++;
        } else if( clicked === prev ) {
           // Handle infinity right here for main images
           this.currentIndex === 0 ? this.currentIndex = this.imageCount - 1 : this.currentIndex--;
           // Infinity for thumbs will be handled further down
           this.currentIndexThumbs--;
        }
 
        // Index is updated, go to the correct slide
        this.goToSlide( this.currentIndex, this.currentIndexThumbs );
        if (this.thumbsEnabled ) {
          this.handleInfinity();
        }
 
      });
    }
 
    findImageVariant( selectedID ) {
      let newID = selectedID.toString();
      let imagesWithIDs = Array.from( this.main.querySelectorAll('ol.image-container') );
      for ( let i = 0; i < imagesWithIDs.length; i++ ) {
        let ids = imagesWithIDs[i].getAttribute('data-variant-id');
        if ( ids ) {
          let newImage = ids.includes( newID );
          if ( newImage ) {
            return imagesWithIDs[i];
          }
        }
      }
    }
 
    enableVariantSelection() {
      if ( this.productOptions ) {
        this.productOptions.addEventListener('change',() => {
          setTimeout(() => {
            let selectedProduct = parseInt(this.productOptions.querySelector('select.product-select').value);
 
            let newImage = this.findImageVariant( selectedProduct );
            let newImageIndex;
            newImage ? newImageIndex = this.imagesMain.indexOf(newImage) : newImageIndex = undefined;
 
            if ( newImage && this.device === 'desktop' ) {
              this.currentIndex = newImageIndex;
              this.currentIndexThumbs = newImageIndex + 4;
              this.goToSlide( this.currentIndex, this.currentIndexThumbs );
            } else if ( newImage && this.device === 'mobile' ) {
              let newImageOffset = newImage.offsetLeft - 20;
              this.updateDots( newImage );
              this.main.scroll({
                top: 0,
                left: newImageOffset,
                behavior: 'smooth'
              });
            }
 
          }, 2);
        });
      }
    }
 
    checkDeviceType() {
      if( window.innerWidth > 900 ) {
        this.device = 'desktop';
      } else {
        this.device = 'mobile';
      }
    }
 
    goToSlide( indexMain, indexThumb ) {
      // Start by handling the main, large images
      this.imagesMain.forEach( image => {
        image.classList.remove('is-active');
      });
      this.imagesMain[ indexMain ].classList.add('is-active');
 
      // Now handle the thumbnails
      if ( this.thumbsEnabled ) {
        // Handle thumb movement
        let newImage = this.imagesThumbs[indexThumb];
        if ( newImage ) {
          // Only set up new slider position if the index image exists
          let newImageWidth = newImage.offsetWidth;
          let thumbOffset = (newImageWidth * indexThumb) - (newImageWidth * 1.5);
          newImageWidth = newImage.offsetWidth + 5;
          this.thumbs.style.transform = `translateX(-${ thumbOffset }px) scale3d(1, 1, 1)`;
        }
      }
    }
 
    handleInfinity() {
      // This only runs for thumbs, to create the infinite look
      let indexNum = this.currentIndexThumbs;
      let end = this.imageCount + 3;
      let beg = 3;
      // We've reached either the end or the beginning of the slideshow
      if( indexNum <= beg || indexNum >= end ) {
        // Set all of this in a timeout to make sure the slide transition has already happened
        setTimeout( () => {
          // First, remove transition so we can update the slideshow without any visual change
          this.thumbs.style.transition = 'none';
 
          if( indexNum <= beg ) {
            // We need to go backwards in the slideshow, but make it look like an endless loop
            this.goToSlide( this.currentIndex, end );
            this.currentIndexThumbs = end;
          } else if( indexNum >= end ) {
            // We're going forward, restart the slideshow
            this.goToSlide( this.currentIndex, beg );
            this.currentIndexThumbs = beg;
          }
 
          // Now add transition back in
          setTimeout( () => {
            this.thumbs.style.transition = 'transform .25s';
          }, 10);
 
        }, 250);
      }
    }
 
    runOnResize() {
      let delay = 100; // delay between calls
      let throttled = false; // are we currently throttled?
      window.addEventListener('resize', () => {
        // only run if we're not throttled
        if (!throttled) {
 
          this.checkDeviceType();
          this.buildSlideshow();
          if ( this.device === 'desktop' ) {
            this.goToSlide( this.currentIndex, this.currentIndexThumbs );
          }
 
          // we're throttled!
          throttled = true;
          // set a timeout to un-throttle
          setTimeout( () => {
            throttled = false;
          }, delay);
        }
      });
    }
 
    run() {
      this.buildSlideshow();
      if ( this.device === 'desktop' ) {
        this.goToSlide( this.currentIndex, this.currentIndexThumbs );
      }
 
      this.runOnResize();
    }
  }



  const productSlideshow = document.querySelector('.product__images--slider');

  if ( productSlideshow ) {
    let productSlideshowSystem = new vanillaJSImageSlider( productSlideshow );
    productSlideshowSystem.run();
  }