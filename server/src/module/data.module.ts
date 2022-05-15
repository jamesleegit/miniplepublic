export class DataModule<T> {
    constructor(public lookupFieldNames: string[]) {
        lookupFieldNames.forEach(fieldName => {
            this.lookups[fieldName] = {};
        });
    }

    getItem(query: T): T {
        return this.getItems(query)[0];
    }

    getItems(query: T): T[] {
        const fieldNames = Object.keys(query);
        if (fieldNames.length === 1 && this.lookupFieldNames.indexOf(fieldNames[0]) !== -1) {
            return this.lookups[fieldNames[0]][query[fieldNames[0]]] || [];
        } else {
            let list: T[] = this.list;
            // and 적용 고도화시킬 수 있음.
            for (let i = 0; i < fieldNames.length; i++) {
                if (this.lookupFieldNames.indexOf(fieldNames[i]) !== -1) {
                    list = this.lookups[fieldNames[i]][query[fieldNames[i]]] || [];
                    break;
                }
            }
            return list.filter(item => {
                for (let fieldName in query) {
                    if (item[fieldName] != query[fieldName]) {
                        return false;
                    }
                }
                return true;
            });
        }
    }

    update(query: T, change: T) {
        const list = [...this.getItems(query)];
        list.forEach(item => {
            for (let fieldName in change) {
                if (item[fieldName] !== change[fieldName] && this.lookupFieldNames.indexOf(fieldName) !== -1) {
                    const index = this.lookups[fieldName][<any>item[fieldName]].findIndex(_item => _item === item);
                    if (index !== -1) {
                        this.lookups[fieldName][<any>item[fieldName]].splice(index, 1);
                    }
                    item[fieldName] = change[fieldName];
                    if (!this.lookups[fieldName][<any>change[fieldName]]) {
                        this.lookups[fieldName][<any>change[fieldName]] = [];
                    }
                    this.lookups[fieldName][<any>change[fieldName]].push(item);
                } else {
                    item[fieldName] = change[fieldName];
                }
            }
        });
    }

    remove(query: T) {
        const list = this.getItems(query);
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const index = this.list.indexOf(list[i]);
            if (index !== -1) {
                this.list.splice(index, 1);
                this.lookupFieldNames.forEach(fieldName => {
                    const arr = this.lookups[fieldName][item[fieldName]] || [];
                    const index = arr.indexOf(item);
                    if (index !== -1) {
                        arr.splice(index, 1);
                    }
                });
            }
        }
    }

    set(obj: T[]) {
        this.list = [];
        this.insertItems(obj);
    }

    insertItems(obj: T[]) {
        obj.forEach(item => this.insert(item));
    }

    insert(obj: T) {
        this.list.push(obj);
        this.lookupFieldNames.forEach(fieldName => {
            if (!this.lookups[fieldName][obj[fieldName]]) {
                this.lookups[fieldName][obj[fieldName]] = [];
            }
            this.lookups[fieldName][obj[fieldName]].push(obj);
        });
    }

    list: T[] = [];
    lookups: { [fieldName: string]: { [tag: string]: T[] } } = {};
}