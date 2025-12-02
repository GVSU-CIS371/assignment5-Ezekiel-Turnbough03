import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import bases from "../data/bases.json";
import syrups from "../data/syrups.json";
import creamers from "../data/creamers.json";
import { db } from "../firebase"
import {
  collection,
  getDocs,
  setDoc,
  doc,
  QuerySnapshot,
  QueryDocumentSnapshot,
  onSnapshot,
  query,
  where,
  Unsubscribe,
} from "firebase/firestore";
import type { User } from "firebase/auth";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
    user: null as User | null,
    snapshotUnsubscribe: null as Unsubscribe | null,
  }),

  actions: {
    init() {
      const baseCollection = collection(db, "bases");
      getDocs(baseCollection)
        .then((qs: QuerySnapshot) => {
          if (qs.empty) {
            bases.forEach((b) => {
              const base = doc(db, `bases/${b.id}`);
              setDoc(base, { name: b.name, color: b.color })
                .then(() => {
                  console.log(`New base with ID ${b.id} inserted`);
                })
                .catch((error: any) => {
                  console.error("Error adding document: ", error);
                });
            });
            this.bases = bases;
          } else {
            this.bases = qs.docs.map((qd: QueryDocumentSnapshot) => ({
              id: qd.id,
              name: qd.data().name,
              color: qd.data().color,
            })) as BaseBeverageType[];
          }
          this.currentBase = this.bases[0];
          console.log("getting bases: ", this.bases);
        })
        .catch((error: any) => {
          console.error("Error getting documents:", error);
        });
      const syrupCollection = collection(db, "syrups");
      getDocs(syrupCollection)
        .then((qs: QuerySnapshot) => {
          if (qs.empty) {
            syrups.forEach((b) => {
              const syrup = doc(db, `syrups/${b.id}`);
              setDoc(syrup, { name: b.name, color: b.color })
                .then(() => {
                  console.log(`New syrup with ID ${b.id} inserted`);
                })
                .catch((error: any) => {
                  console.error("Error adding document: ", error);
                });
            });
            this.syrups = syrups;
          } else {
            this.syrups = qs.docs.map((qd: QueryDocumentSnapshot) => ({
              id: qd.id,
              name: qd.data().name,
              color: qd.data().color,
            })) as SyrupType[];
            console.log("getting syrups: ", this.syrups);
          }
          this.currentSyrup = this.syrups[0];
        })
        .catch((error: any) => {
          console.error("Error getting syrups:", error);
        });

      const creamerCollection = collection(db, "creamers");
      getDocs(creamerCollection)
        .then((qs: QuerySnapshot) => {
          if (qs.empty) {
            creamers.forEach((b) => {
              const creamer = doc(db, `creamers/${b.id}`);
              setDoc(creamer, { name: b.name, color: b.color })
                .then(() => {
                  console.log(`New creamer with ID ${b.id} inserted`);
                })
                .catch((error: any) => {
                  console.error("Error adding document: ", error);
                });
            });
            this.creamers = creamers;
          } else {
            this.creamers = qs.docs.map((qd: QueryDocumentSnapshot) => ({
              id: qd.id,
              name: qd.data().name,
              color: qd.data().color,
            })) as CreamerType[];

            console.log("getting creamers: ", this.creamers);
          }
          this.currentCreamer = this.creamers[0];
        })
        .catch((error: any) => {
          console.error("Error getting creamers:", error);
        });
    },

    showBeverage() {
      if (!this.currentBeverage) return;
      this.currentName = this.currentBeverage.name;
      this.currentTemp = this.currentBeverage.temp;
      this.currentBase = this.currentBeverage.base;
      this.currentSyrup = this.currentBeverage.syrup;
      this.currentCreamer = this.currentBeverage.creamer;
      console.log(
        `currentBeverage changed`,
        this.currentBase,
        this.currentCreamer,
        this.currentSyrup
      );
    },
    async makeBeverage() {

    if (!this.user) {
      return "You must sign in to make a beverage.";
    }

    if (!this.currentName.trim() ||!this.currentBase || !this.currentSyrup || !this.currentCreamer) 
    {
      return "You must enter a beverage name, base, syrup, and creamer to make a beverage.";
    }

  const db_ref = doc(collection(db, "beverages"));
  const drink: BeverageType = {
    id: db_ref.id,
    name: this.currentName,
    temp: this.currentTemp,
    base: this.currentBase,
    syrup: this.currentSyrup,
    creamer: this.currentCreamer,
    userId: this.user.uid
  };

  try {
    await setDoc(db_ref, drink);

    this.beverages.push(drink);
    this.currentBeverage = drink;

    return `Beverage "${this.currentName}" made successfully!`;
  } 
  catch (error) {
    console.error("Error making beverage:", error);
    return "There was an issue creating your beverage.";
  }
}, 
    async setUser(user: User | null) 
    {
      console.log("Adding User: ", user?.uid || "null");
      this.user = user;
      if (this.snapshotUnsubscribe)
        {
          this.snapshotUnsubscribe();
          this.snapshotUnsubscribe = null
        }
      if (!user)
        {
          this.beverages = [];
          this.currentBeverage = null;
          return;
        }
      const drink_ref = collection(db, "beverages");
      const db_query = query(drink_ref, where("userId", "==", user.uid))

      this.snapshotUnsubscribe = onSnapshot(db_query, (qs: QuerySnapshot) => {
    this.beverages = qs.docs.map((d) => ({
      ...(d.data() as BeverageType),
      id: d.id,
    }));

    if (this.beverages.length < 1)
      {
        this.currentBeverage = null;
      }
  else
      {
        this.currentBeverage = this.beverages [0];
        this.showBeverage();
      }
      console.log("Beverages:", this.beverages);
});
    }
}})