const fs = require("fs").promises;

class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    //Métodos: 

    async addProduct(nuevoObjeto) {
        let { title, description, price, img, code, stock } = nuevoObjeto;

        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Todos los campos son obligatorios, completalo o moriras en 24 hs");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("El codigo debe ser unico, rata de dos patas!");
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }


        this.products.push(newProduct);

        //Guardamos el array en el archivo: 

        await this.guardarArchivo(this.products);

    }

    getProducts() {
        console.log(this.products);
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no encontrado");
            } else {
                console.log("Siii, lo encontramos! ");
                return buscado;
            }

        } catch (error) {
            console.log("Error al leer el archivo ", error);
        }

    }

    //Nuevos metodos desafio 2: 

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;

        } catch (error) {
            console.log("Eerror al leer un archivo", error);
        }
    }

    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
        }
    }

    //Actualizamos algun producto:
    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                //Puedo usar el método de array splice para reemplazar el objeto en la posicion del index: 
                arrayProductos.splice(index, 1, productoActualizado);
                await this.guardarArchivo(arrayProductos);
            } else {
                console.log("no se encontró el producto");
            }

        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

}

//Testing: 

//Se creará una instancia de la clase “ProductManager”

const manager = new ProductManager("./productos.json");

//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []


manager.getProducts();


//Se llamará al método “addProduct” con los campos:
//title: “producto prueba”
//description:”Este es un producto prueba”
//price:200,
//thumbnail:”Sin imagen”
//code:”abc123”,
//stock:25

const fideos = {
    title: "fideos",
    description: "los mas ricos",
    price: 150,
    img: "sin imagen",
    code: "abc123",
    stock: 30
}


manager.addProduct(fideos);

//El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE



const arroz = {
    title: "arroz",
    description: "el que no se pasa",
    price: 250,
    img: "sin imagen",
    code: "abc124",
    stock: 30
}


manager.addProduct(arroz);

const aceite = {
    title: "aceite",
    description: "esta carisimo",
    price: 15000,
    img: "sin imagen",
    code: "abc125",
    //stock: 30
}

//Repetimos el codigo: 

//manager.addProduct(aceite);
//Las validaciones funcionan. 

//Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado


manager.getProducts();

//Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.

async function testeamosBusquedaPorId() {
    const buscado = await manager.getProductById(2);
    console.log(buscado);
}

testeamosBusquedaPorId();

//Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.

const salsa = {
    id: 1,
    title: "salsa tomate", 
    description: "los mas ricos", 
    price: 150,
    img: "Sin imagen",
    code: "abc123",
    stock: 30
};

async function testeamosActualizar() {
    await manager.updateProduct(1, salsa);
}

testeamosActualizar();