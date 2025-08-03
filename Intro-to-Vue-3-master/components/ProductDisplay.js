app.component('product-display',{
    props:{
        premium: {
            type: Boolean,
            required: true
        }
    },
    template:
    /*html*/
    `<div class="product-container">
          <div class="product-image">
            <img :class="{ 'out-of-stock-img': !inStock }" v-bind:src="image">
          </div>
            <div class="product-info">
              <h1>{{ title }}</h1>
              <!--Stocks-->
              <p v-if="inStock" style="color:green">In Stock</p>
              <p v-else-if="inStock <= 20 && inStock > 0" style="color:gold">Almost Out</p>
              <p v-else style="color:red">Out of Stock</p>
              <p>Shipping: {{ shipping }}</p>
              <!--Sale-->
              <p style="color:chartreuse">{{onsale}}</p>
              <!--Details-->
              <ul><li v-for="detail in details">{{detail}}</li></ul>
              <div 
              v-for="(variant,index) in variants" 
                :key="variant.id" 
                @mouseover="updatevariant(index)"
                class="color-circle"
                :style="{backgroundColor:variant.color}">
                {{}}</div>
              <div v-for="size in sizes" :key="size.id">{{size.size}}</div>
              <p>{{ desc }}</p>
              <div></div>
              <!--Buttons-->
              <button 
              class="button"
              :disabled="!inStock"
              :class="{disabledButton: !inStock}"
              @click="addToCart">Add to Cart</button>
              <br>
              <button
               class="button" 
               :class="{ disabledButton: !inStock }" 
               :disabled="!inStock" 
              @click="delFromCart">Remove from Cart</button>
            </div>
              <div class="Link">
                <a v-bind:href="link" target="_blank">Not a Virus</a>
                </div>
                <review-list v-if="reviews.length" :reviews="reviews"></review-list>
                <review-form @review-submitted="addReview"></review-form>  
        </div>`,
            data: function(){
        return{

            product: 'Socks',
            brand: 'Dingaling',
            selectedVariant:0,
            desc: 'We will measure your feet',
            link:'https://picsum.photos',
            sale:true,
            details:['50% cotton','30% wool','20% polyester'],
            variants:[
                {id:2234,color:'Green',image:"./assets/images/socks_green.png",quantity: 50},
                {id:2235,color:'Blue',image:"./assets/images/socks_blue.png",quantity: 0,},
            ],
            sizes:[
                {id:25,size:'40'},
                {id:26,size:'41'},
            ],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].id)
        },
        updatevariant(index){
            this.selectedVariant= index
        },
        delFromCart(){
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].id)
        },
        addReview(review) {
        this.reviews.push(review)
            }
    },
    computed:{
        title(){
            return this .brand + ' ' + this.product
        },
        image(){
            return this.variants[this.selectedVariant].image
        },
        inStock(){
            return this.variants[this.selectedVariant].quantity
        },
        onsale(){
            if (this.sale) {
                return this.brand + ' ' + this.product + ' is on sale.'
            }
            return ''
        },
        shipping() {
            if (this.premium) {
                return 'Free'
            }
            return 2.99
        }
    },
    
})