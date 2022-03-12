import { Component } from '@angular/core';

@Component({
    selector: 'app-testimonial',
    templateUrl: './testimonial.component.html',
    styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent {

    constructor() { }

    // Testimonial Carousel
    public testimonial = [{
        image: '/assets/images/listshop/testimonial/cutting board.png',
        name: 'Targeted Shopping',
        designation: 'Targeted Shopping',
        description: 'Targeted shopping means shopping for what you\'ll cook, and cooking what you\'ve shopped for.  It\'s a simple idea, but has a powerful effect in cutting down food waste and money spent.  On top of that, it\'s much easier to answer the question "What\'s for dinner tonight?". Targeted Shopping is about knowing that you have the ingredients on hand to be able to put dinner on the table.',
    }, {
        image: '/assets/images/listshop/testimonial/bowl.png',
        name: 'Dishes - The Building Blocks',
        designation: 'Dishes - The Building Blocks',
        description: 'At <span class="listshop-name">the list shop</span>, we\'ve made adding a dish as quick and easy as possible. You work with your dishes - what you know how to make.  Once you\'ve added a few dishes,  making a shopping list can be a matter of just picking out what dishes you want to make, and adding those to the list.  There will be things on the list which are already on hand.  No problem - swipe to remove them.  <span class="listshop-name">the list shop</span> will even keep track of what items you remove most frequently over time, and group them together, making it even easier to remove them next time.  ',
    },  {
        image: '/assets/images/listshop/testimonial/ladle.png',
        name: 'Multiple Lists',
        designation: 'Multiple Lists',
        description: 'Keep multiple lists to organize your shopping.  Designate a starter list for the things you get on larger shopping trips.  Keep a list  of things that fly across your mind to pick up the next time you go to the store - a "fridge list".   When it\'s time to put together a new shopping list,  add the starter list, and you already have the basics.  Add the fridge list,  and you have the things you don\'t want to forget.  With a couple clicks, you have a base list ready.  Now you can concentrate on making sure you have the things you need for the dishes you\'ll make.',
    },  {
        image: '/assets/images/listshop/testimonial/measuring cup.png',
        name: 'Items, Items, Items...',
        designation: ' Items, Items, Items...',
        description: 'You\'ll notice that there aren\'t any quantities in <span class="listshop-name">the list shop</span>.  This is on purpose.  <span class="listshop-name">the list shop</span> is not based on recipes, but on the idea of a dish as a collection of ingredients - which can be added to a list.   Recipes deal with specific amounts.  Shopping lists deal with items, and so <span class="listshop-name">the list shop</span> deals with items.  Sure, it\'ll be good to have quantities.  Completing a dish with  quantities and instructions  is a planned feature.  But the core of <span class="listshop-name">the list shop</span> will always be based upon items.',
    },];

    // Testimonial Carousel Options
    public testimonialCarousel: any = {
        loop: true,
        margin: 5,
        nav: true,
        navClass: ['owl-prev', 'owl-next'],
        navText: ['<img src="assets/images/back.png">', '<img src="assets/images/next.png">'],
        dots: false,
        responsive: {
            0: {
                items: 1,
                dots: true,
                nav: false
            },
            600: {
                items: 1,
                dots: true,
                nav: false
            },
            991: {
                items: 1,
                margin: 15,
            },
            1000: {
                items: 1
            }
        }
    };

}
