import { PipeTransform, Pipe} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'ohListObject'})
export class ListObject implements PipeTransform {
  transform(objeto, args:string[]) : any {
    let lista = [];
    for (let llave in objeto) {
      lista.push({key: llave, object: objeto[llave]});
    }
    return lista;
  }
}

@Pipe({name: 'ohFilterField'})
export class FilterField implements PipeTransform {
  transform(items: any[], field: any, value: any): any[] {
    if (!items) return [];
    if( typeof(field) != "string"){
      var mapId = {};
      for(var i in value[1]){
        mapId[value[1][i]] = true;
      }
      return items.filter((elemento) => {
        return elemento[field[0]] == value[0] && mapId[elemento[field[1]]];
      });
    } else {
      return items.filter(it => it[field] == value);
    }
    
  }
}

@Pipe({name: 'ohFilterCount'})
export class FilterCount implements PipeTransform {
  transform(items: any[], field: string, value: string): number {
    if (!items) return 0;
    return items.filter(it => it[field] == value).length;
  }
}

@Pipe({ name: 'ohReverse'})
export class Reverse {
  transform(value) {
    if(value && value.slice){
      return value.slice().reverse();
    }
  }
}

const _NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;

@Pipe({name: 'ohCurrency'})
export class CurrencyCustom extends CurrencyPipe {
  transform(
    value: any, currencyCode?: string,
    display: 'code'|'symbol'|'symbol-narrow'|boolean = 'symbol', digits?: string,
    locale?: string
  ) : string|null {
      var res = super.transform(value, currencyCode, display, digits, locale);
      if(currencyCode=="PEN"){
        return "S/ "+res.substr(3);
      } else if(currencyCode=="USD"){
        return "$ "+res.substr(1);
      } else {
        return res;
      }
  }
}

@Pipe({
  name: 'ohFilter',
  pure: false
})
export class FilterList implements PipeTransform {
  transform(items: any, filter: any): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item: any) => this.applyFilter(item, filter));
  }
  // filter = {name : "adasda"}
  applyFilter(book: any, filter: any): boolean {
    if(book.object){
      book = book.object;
    }
    for (let field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (book[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (book[field] !== filter[field]) {
            return false;
          }
        }
      } 
    }
    return true;
  }
}

@Pipe({ name: 'ohSafeHtml' })
export class SafeHtml implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }
    transform(value) {
        if (value && value.length > 0) {
            return this.sanitized.bypassSecurityTrustHtml(value);
        } else {
            return value;
        }
    }
}

@Pipe({ 
  name: 'ohCurrencyFormat'
})
export class LocaleCurrency implements PipeTransform {
  transform(
    val: number,
    currencySign: string = 'S/',
    localeString: string = 'es-PE'): string {
    if (val !== undefined && val !== null) {
    return currencySign+val.toLocaleString(localeString);
    } else {
    return '';
    }
  }
} 