import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import store from '../store'

export const useAppDispatch = () => useDispatch()
export const useAppSelector = (selector) => useSelector(selector)
export { store }
