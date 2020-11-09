import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public products: any[] = [];
  public coins: number = 0;
  public change = 0;
  public loading = false;

  constructor(private afStore: AngularFirestore) { }

  pickProduct(id, price:number, quantity: number){
    setTimeout(() => {
      if(quantity > 0){
        if(this.coins >= price){
          this.change = this.coins - price;
          this.coins = this.change;
          this.updateQuantity(quantity, id);
          alert('Purcahse successful!!')
          this.products = [];
          this.getProducts();
        }else{
          alert('Insufficient coins, please add more')
        }
      }else{
        alert('Out of stock')
      }
    }, 3000);
  }

  getProducts(){
    let products = [];
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
        products.push(product);
      });
    });
    return products;
  }
  
  updateQuantity(quantity, id){
    this.afStore.firestore.collection('products')
      .doc(id)
      .update({
      "qty": --quantity
    })
  }
}
