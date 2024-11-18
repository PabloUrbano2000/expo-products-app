import { updateCreateProduct } from '@/core/products/actions/create-update-product.action'
import { getProductById } from '@/core/products/actions/get-product-by-id.action'
import { Product } from '@/core/products/interfaces/product.interface'
import { useCameraStore } from '@/presentation/store/useCameraStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { Alert } from 'react-native'

export const useProduct = (productId: string) => {
  // temporal
  const { clearImages } = useCameraStore()

  const queryClient = useQueryClient()
  const productIdRef = useRef(productId)

  const productQuery = useQuery({
    queryKey: ['products', productId],
    queryFn: () => getProductById(productId),
    staleTime: 1000 * 60 * 60 // 1 hora
  })

  // Mutación
  const productMutation = useMutation({
    mutationFn: async (data: Product) => {
      return updateCreateProduct({
        ...data,
        id: productIdRef.current
      })
    },
    onSuccess: (data: Product) => {
      productIdRef.current = data.id

      // limpiamos las imagenes que están en memoria
      clearImages()

      // invalidamos los queries
      queryClient.invalidateQueries({
        queryKey: ['products', 'infinite']
      })
      queryClient.invalidateQueries({
        queryKey: ['products', data.id]
      })
      Alert.alert('Producto guardado', `${data.title} se guardó correctamente`)
    }
  })

  // Mantener el ID del producto en caso de ser nuevo

  return {
    productQuery,
    productMutation
  }
}