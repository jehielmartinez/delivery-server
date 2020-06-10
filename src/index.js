import { GraphQLServer } from 'graphql-yoga'

const users = [{
  id: '1',
  name: 'Jehiel',
  email: 'jehiel@example.com',
  address: 'Col. Villas del Sol',
  age: 28
},
{
  id: '2',
  name: 'Astrid',
  address: 'Col. Villas del Sol',
  email: 'astrid@example.com',
  age: 28
},
{
  id: '3',
  name: 'Mike',
  address: 'Col. Villas del Sol',
  email: 'mike@example.com',
  age: 28
}]

const merchants = [{
  id: '111',
  name: 'Dunkin Donuts',
  address: 'Col. Jardines del Valle',
  city: 'San Pedro Sula',
  state: 'Cortes'
}]

const categories = [{
  id: '1111',
  name: 'Food'
}]

const products = [{
  id: '11',
  name: 'CheeseCake Donut',
  description: 'A donut sparkled with glass sugar with a filling of cheesecake',
  value: 15,
  stock: 20,
  merchant: '111',
  category: '1111'
},
{
  id: '12',
  name: 'Boston Creme',
  description: 'A donut covered with chocolate with a filling of cream',
  value: 15,
  stock: 20,
  merchant: '111',
  category: '1111'
}]

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        merchants: [Merchant!]!
        products: [Product!]!
        categories: [Category!]!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        address: String!
        age: Int
    }
    type Merchant {
        id: ID!
        name: String!
        city: String!
        address: String!
        state: String!
        products: [Product!]!
    }
    type Product {
        id: ID!
        name: String!
        description: String!
        value: Float!
        stock: Int!
        merchant: Merchant!
        category: Category!
    }
    type Category {
        id: ID!
        name: String!
        products: [Product!]!
    }
`
const resolvers = {
  Query: {
    me () {
      return users[0]
    },
    users (parent, args, content, info) {
      const { query } = args
      if (!args.query) {
        return users
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(query.toLowerCase())
      })
    },
    merchants (parent, args, content, info) {
      const { query } = args
      if (!query) {
        return merchants
      }
      return merchants.filter(merchant => {
        const isTitleMatch = merchant.title.toLowerCase().includes(query.toLowerCase())
        const isBodyMatch = merchant.body.toLowerCase().includes(query.toLowerCase())
        return isTitleMatch || isBodyMatch
      })
    },
    products (parent, args, content, info) {
      return products
    },
    categories (parent, args, content, info) {
      return categories
    }
  },
  Product: {
    merchant (parent, args, content, info) {
      return merchants.find(merchant => merchant.id === parent.merchant)
    },
    category (parent, args, content, info) {
      return categories.find(category => category.id === parent.category)
    }
  },
  Merchant: {
    products (parent, args, content, info) {
      return products.filter(product => product.merchant === parent.id)
    }
  },
  Category: {
    products (parent, args, content, info) {
      return products.filter(product => product.category === parent.id)
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up')
})
