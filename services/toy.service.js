import fs from 'fs'
import { utilService } from "./util.service.js"

const PAGE_SIZE = 5
const toys = utilService.readJsonFile('data/toy.json')

export const toyService = {
    query,
    get,
    remove,
    save
}

function query(filterBy = {}) {
    let toysToDisplay = toys
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        toysToDisplay = toysToDisplay.filter(toy => regExp.test(toy.name))
    }
    if (filterBy.inStock) {
        if (filterBy.inStock === 'false') {
            toysToDisplay = toysToDisplay.filter(toy => toy.inStock === false)
        } else {
            toysToDisplay = toysToDisplay.filter(toy => toy.inStock === true)
        }
    }
    if (filterBy.labels && filterBy.labels[0]) {
        toysToDisplay = toysToDisplay.filter(toy => {
            return toy.labels.some(label => filterBy.labels.includes(label))
        })
    }
    if (filterBy.pageIdx !== undefined) {
        let startIdx = filterBy.pageIdx * PAGE_SIZE
        toysToDisplay = toysToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(toysToDisplay)
        }, 500)
    })
    return Promise.resolve(toysToDisplay)
}

function get(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const toy = toys.find(toy => toy._id === toyId)
            if (!toy) {
                reject('Toy not found');
            } else {
                resolve(toy)
            }
        }, 500)
    })
    if (!toy) return Promise.reject('Toy not found')
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No such toy')
    const toy = toys[idx]
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
    } else {
        toy._id = _makeId()
        toys.push(toy)
    }
    return _saveToysToFile().then(() => toy)
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {

        const toysStr = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', toysStr, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('The file was saved!');
            resolve()
        });
    })
}