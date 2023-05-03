import { useParams } from "react-router-dom"


export default function usePageType() {
  const { type, id } = useParams()
  const isAdd = type === 'add'
  const isEdit = type === 'edit'
  const isViewOnly = type === 'view' || (type !== 'add' && type !== 'edit')

  return { isAdd, isEdit, isViewOnly, type, id }
}
