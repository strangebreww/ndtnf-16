import { Container } from 'inversify'
import 'reflect-metadata'
import BooksRepository from './BooksRepository'

const container = new Container()
container.bind(BooksRepository).toSelf()

module.exports = container
