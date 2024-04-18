import { SelectPage } from "../pages/SelectPage";

class BaseSelect {
    name: string = "world";
   
    constructor(otherName?: string) {
      if (otherName !== undefined) {
        this.name = otherName;
      }
    }

    chooseMe () {
        let chooseControl = SelectPage.getKontrol(); 
        if (chooseControl) {
            console.log('I did it');
        }    
    }
}
