import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {

  public products: any[] = [];
  public coins: number = 0;
  public change = 0;
  public loading = false;

  constructor(private afStore: AngularFirestore) { }

  ngOnInit(): void {
    this.getProducts();
  }

  async pickProduct(id, price:number, quantity: number){
      if(quantity > 0){
        if(this.coins >= price){
          this.change = this.coins - price;
          this.coins = this.change;
          this.updateQuantity(quantity, id);
          this.products = [];
          this.loading = true;
          await setTimeout(async() => {
            this.loading = false;
            this.getProducts();
            alert('Purcahse successful!!')
          }, 3000);

        }else{
          alert('Insufficient coins, please add more')
        }
      }else{
        alert('Out of stock')
      }

  }

  

  updateQuantity(quantity, id){
    this.afStore.firestore.collection('products')
      .doc(id)
      .update({
      "qty": --quantity
    })
  }

  refresh(){
    this.coins = 0;
  }

  addCoin(amount){
    this.coins+= amount;
  }

  getProducts(){
    this.afStore.firestore.collection("products").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) =>{
        let product = {
          id: doc.id,
          name: doc.data().name,
          imgurl: doc.data().imgurl,
          price: doc.data().price,
          qty: doc.data().qty
        }
        this.products.push(product);
      });
    });
  }
}
