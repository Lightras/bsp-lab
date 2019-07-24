import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EuFormulasService {

  constructor() { }

   EU0(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp + (1-Pi)*Spi*Utn + Pi*(1-Sei)*Ufn;
   }

   EU1(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      // eq v n i
      return Pi * Sei * Utp + (1 - Pi) * (1 - Spi) * Ufp +
         (1 - Pi) * Spi * ((1 - Spj) * Ufp + Spj * Utn) +
         Pi * (1 - Sei) * (Sej * Utp + (1 - Sej) * Ufn);
   }

   EU2(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      // eq v p i
      return Pi * Sei * (Sej * Utp + (1 - Sej) * Ufn) +
         (1 - Pi) * (1 - Spi) * ((1 - Spj) * Ufp + Spj * Utn) +
         (1 - Pi) * Spi * Utn + Pi * (1 - Sei) * Ufn;
   }

   EU3(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      if (Pj > 1-Pi) {
         this.logError(3);
      }
      // ni v n i
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp + (1-Pi)*Spi*(Pj/(1-Pi)*Sej*Utp + (1-Pi-Pj)/(1-Pi)*(1-Spj)*Ufp + (1-Pi-Pj)/(1-Pi)*Spj*Utn +
         Pj/(1-Pi)*(1-Sej)*Ufn) + Pi*(1-Sei)*(Spj*Utn + (1-Spj)*Ufp);
   }

   EU4(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      if (Pj > 1-Pi) {
         this.logError(4);
      }
      // ni v p i
      return (1-Pi)*Spi*Utn + Pi*(1-Sei)*Ufn + (1-Pi)*(1-Spi)*(Pj/(1-Pi)*Sej*Utp + (1-Pi-Pj)/(1-Pi)*(1-Spj)*Ufp +
         (1-Pi-Pj)/(1-Pi)*Spj*Utn + Pj/(1-Pi)*(1-Sej)*Ufn) + Pi*Sei*(Sej*Utn + (1-Sej)*Ufp);
   }

   EU5(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      if (Pj > Pi) {
         this.logError(5);
      }
      // j<i v n i
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp + (1-Pi)*Spi*(Spj*Utn + (1-Spj)*Ufn) + Pi*(1-Sei)*((Pj/Pi)*Sej)*Utp +
         (Pi-Pj)/Pi*(1-Spj)*Ufp + (Pi-Pj)/Pi*Spj*Utn + (Pj/Pi)*(1-Sej)*Ufn;
   }

   EU6(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      if (Pj > Pi) {
         this.logError(6);
      }
      // j<i v p i
      return (1-Pi)*Spi*Utn + Pi*(1-Sei)*Ufn + (1-Pi)*(1-Spi)*(Spj*Utn + (1-Spj)*Ufn) +
         Pi*Sei*((Pj/Pi)*Sej*Utp + (Pi-Pj)*Pi*(1-Spj)*Ufp + (Pi-Pj)/Pi*Spj*Utn + (Pj/Pi)*(1-Sej)*Ufn);
   }

   EU7(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      if (Pi > Pj) {
         this.logError(7);
      }
      // i<j v n i
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp +
         (1-Pi)*Spi*((Pj-Pi)/(1-Pi)*Sej)*Utp + (1-Pj)/(1-Pi)*(1-Spj)*Ufp + (1-Pj)/(1-Pi)*Spj*Utn + (Pj-Pi)/(1-Pi)*(1-Sej)*Ufn +
         Pi*(1-Sei)*(Sej*Utp + (1-Sej)*Ufn);
   }

   EU8(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      if (Pi > Pj) {
         this.logError(8);
      }
      // i<j v p i
      return (1-Pi)*Spi*Utn +
         Pi*(1-Sei)*Ufn +
         (1-Pi)*(1-Spi)*(
            (Pj-Pi)/(1-Pi)*Sej*Utp +
            (1-Pj)/(1-Pi)*(1-Spj)*Ufp +
            (1-Pj)/(1-Pi)*Spj*Utn +
            (Pj-Pi)/(1-Pi)*(1-Sej)*Ufn
         ) +
         Pi*Sei*(
            Sej*Utp + (1-Sej)*Ufn
         );
   }

   EU9(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn, Pij) {
      if (Pij > Pi || Pj > (Pij + 1 - Pi)) {
         this.logError(9)
      }
      // i v n i
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp +
         (1-Pi)*Spi*(
            (Pj-Pij)/(1-Pi)*Sej*Utp +
            (1-Pi-Pj+Pij)/(1-Pi)*(1-Spj)*Ufp +
            (1-Pi-Pj+Pij)/(1-Pi)*(1-Pi)*Spj*Utn +
            (Pj-Pij)/(1-Pi)*(1-Sej)*Ufn
         ) +
         Pi*(1-Sei)*(
            Pij/Pi*Sej*Utp +
            (Pi-Pij)/Pi*(1-Spj)*Ufp +
            (Pi-Pij)/Pi*Spj*Utn +
            Pij/Pi*(1-Sej)*Ufn
         );
   }

   EU10(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn, Pij) {
      if (Pij > Pi || Pj > (Pij + 1 - Pi)) {
         this.logError(10)
      }
      // i v p i
      return (1-Pi)*Spi*Utn + Pi*(1-Sei)*Ufn +
         (1-Pi)*(1-Spi)*(
            (Pj-Pij)/(1-Pi)*Sej*Utp +
            (1-Pi-Pj+Pij)/(1-Pi)*(1-Spj)*Ufp +
            (1-Pi-Pj+Pij)/(1-Pi)*Spj*Utn +
            (Pj-Pij)/(1-Pi)*(1-Sej)*Ufn
         ) +
         Pi*Sei*(
            Pij/Pi*Sej*Utp +
            (Pi-Pij)/Pi*(1-Spj)*Ufp +
            (Pi-Pij)/Pi*Spj*Utn +
            Pij/Pi*(1-Sej)*Ufn
         );
   }

   EU11(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn, Pij) {
      if (Pij > Pi || Pj > (Pij + 1 - Pi)) {
         this.logError(11)
      }
      // i
      return (Pi-Pij)*(1-Sei)*Spj*Utn +
         Pij*(1-Sei)*(1-Sej)*Ufn +
         Pij*(1-Sei)*Sej*Utp +
         (Pi-Pij)*(1-Sei)*(1-Spj)*Ufp +

         (Pi-Pij)*Sei*Spj*Utn +
         Pij*Sei*(1-Sej)*Ufn +
         Pij*Sei*Sej*Utp +
         (Pi-Pij)*Sei*(1-Spj)*Ufp +

         (1-Pj-Pi+Pij)*Spi*Spj*Utn +
         (Pj-Pij)*Spi*(1-Sej)*Ufn +
         (Pj-Pij)*Spi*Sej*Utp +
         (1-Pi-Pj+Pij)*Spi*(1-Sej)*Ufp +

         (1-Pi-Pj+Pij)*(1-Spi)*Spj*Utn +
         (Pi-Pij)*(1-Spi)*(1-Sej)*Ufn +
         (Pi-Pij)*(1-Spi)*Sej*Utp +
         (1-Pi-Pj+Pij)*(1-Spi)*(1-Spj)*Ufp;
   }

   private logError(e) {
      console.error('error: ', e);
   }

}
