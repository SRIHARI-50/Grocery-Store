import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { ProductService } from '../product.service';
import { Cart } from '../cart/Cart';
import { LoginService } from 'src/app/login/login.service';

@Component({
    templateUrl: 'product-list.component.html',
    styleUrls: ['product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
    chkman: any = [];
    chkmanos: any = [];
    rate: number = 0;
    pageTitle = 'My Grocery Store';
    imageWidth = 80;
    imageHeight = 120;
    imageMargin = 12;
    showImage = false;
    listFilter: string = '';
   
    manufacturers = [{ 'id': 'BBroyal', 'checked': false },
    { 'id': 'Gold Winner', 'checked': false },
    { 'id': 'Ashirvad', 'checked': false },
    { 'id': 'Cello', 'checked': false },
    { 'id': 'Scotch', 'checked': false }
    ];
    price_range = [{ 'id': '1-50', 'checked': false },
    { 'id': '51-100', 'checked': false },
    { 'id': '101-150', 'checked': false },
    { 'id': '151-200', 'checked': false }];
    errorMessage: string = '';
    products: any = [];
    selectedItems: any = 0;
    cart!: Cart;
    total = 0;
    orderId = 0;
    selectedManufacturers: string[] = [];
    selectedPrice: string[] = [];
    checkedManufacturers: any[] = [];
    checkedPrice: any[] = [];
    sub: any;
    i = 0;
    sortoption = '';
    chkmanosprice: any = [];

    @ViewChild('loginEl')
    loginVal!: ElementRef;
    @ViewChild('welcomeEl')
    welcomeVal!: ElementRef;

    // Fetches the products data from service class
    constructor(private productService: ProductService, private loginService: LoginService, private renderer: Renderer2) {
    }
    ngAfterViewInit() {
        this.loginVal = this.loginService.loginElement;
        this.welcomeVal = this.loginService.welcomeElement;    

        this.renderer.setProperty(this.loginVal.nativeElement, 'innerText', 'Logout');
       this.renderer.setStyle(this.welcomeVal.nativeElement, 'display', 'inline');
        let welcomeText="Welcome "+this.loginService.username+ "  "; 
        this.renderer.setProperty(this.welcomeVal.nativeElement, 'innerText', welcomeText);
       this.renderer.setStyle(this.welcomeVal.nativeElement, 'color', '#ff0080');

    }
    ngOnInit() {

        this.orderId++;

        this.productService.getProducts()
            .subscribe({
                next:products => {
                    this.productService.products = products;
                    this.products = this.productService.products; 
                    this.chkmanosprice =this.products
                },
                error:error => this.errorMessage = error});

        if (this.productService.selectedProducts.length > 0) {
            this.selectedItems = Number(sessionStorage.getItem('selectedItems'));
            this.total = Number(sessionStorage.getItem('grandTotal'));
        }
    }
    checkManufacturers(cManuf: any[], cProducts: any[]) {
        if (cManuf.length > 0) {
            for (let checkManuf of cManuf) {
                for (let checkProd of cProducts) {
                    if (checkProd.manufacturer.toLowerCase() === checkManuf.toLowerCase()) {
                        this.chkman.push(checkProd);


                    }
                }
            }
        } else {
            this.chkman = cProducts;

        }

    }

    checkPrices(checkedPrice: any[], chkmanos: any[]) {

        if (checkedPrice.length > 0) {

            for (let checkPrice of checkedPrice) {
                for (let chkmanfos of chkmanos) {
                    if (checkPrice === '1-50') {
                        if (chkmanfos.price >= 1 && chkmanfos.price <= 50) {
                            this.chkmanosprice.push(chkmanfos);
                        }
                    }
                    if (checkPrice === '51-100') {
                        if (chkmanfos.price > 50 && chkmanfos.price <= 100) {
                            this.chkmanosprice.push(chkmanfos);
                        }
                    }
                    if (checkPrice === '101-150') {
                        if (chkmanfos.price > 100 && chkmanfos.price <= 150) {
                            this.chkmanosprice.push(chkmanfos);
                        }
                    }
                    if (checkPrice === '151-200') {
                        if (chkmanfos.price > 150 && chkmanfos.price <= 200) {
                            this.chkmanosprice.push(chkmanfos);
                        }
                    }

 
                }
            }
        } else {

            this.chkmanosprice = chkmanos;
           
        }
    }
    


    // Invoked when user clicks on Add to Cart button
    // Adds selected product details to service class variable 
    // called selectedProducts
    addCart(id: number) {
        this.cart = new Cart();
        this.selectedItems += 1;

        // fetching selected product details
        const product = this.productService.products.filter((currProduct: any) => currProduct.productId === id)[0];
        this.total += product.price;
        sessionStorage.setItem('selectedItems', this.selectedItems);
        const sp = this.productService.selectedProducts.filter((currProduct: any) => currProduct.productId === id)[0];
        if (sp) {
            const index = this.productService.selectedProducts.findIndex((currProduct: any) => currProduct.productId === id);
            this.productService.selectedProducts[index].quantity += 1;
            this.productService.selectedProducts[index].totalPrice += product.price;
        } else {
            this.cart.orderId = 'ORD_' + this.orderId;
            this.cart.productId = id;
            this.cart.userId = sessionStorage.getItem('username') + '';
            this.cart.productName = product.productName;
            this.cart.price = product.price;
            this.cart.quantity = 1;
            this.cart.dateOfPurchase = new Date().toString();
            this.cart.totalPrice = product.price * this.cart.quantity;
            this.productService.selectedProducts.push(this.cart);
            sessionStorage.setItem('selectedProducts', JSON.stringify(this.productService.selectedProducts));
            this.orderId++;
        }
    }

    // Invoked when a tab (Tablets/Mobiles) is clicked
    // Displays tablets or mobiles data accordingly
    tabselect(producttype: string) {
        this.manufacturers = [{ 'id': 'BBroyal', 'checked': false },
        { 'id': 'Gold Winner', 'checked': false },
        { 'id': 'Ashirvad', 'checked': false },
        { 'id': 'Cello', 'checked': false },
        { 'id': 'Scotch', 'checked': false }];
        
        this.price_range = [{ 'id': '1-50', 'checked': false },
        { 'id': '51-100', 'checked': false },
        { 'id': '101-150', 'checked': false },
        { 'id': '151-200', 'checked': false }];

        this.products = [];
        this.productService.producttype = producttype;
        this.productService.getProducts().subscribe({
            next: products => {        
                this.products = products;
                this.sortoption='';
            },
            error: error => this.errorMessage = error
        });
      
    }

    // Invoked when user select an option in sort drop down
    // changes the sortoption value accordingly
    onChange(value: string) {
        this.sortoption = value;
    }
}


