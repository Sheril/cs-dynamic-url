import { useCallback, useEffect, useState } from 'react'
import { TextInput } from '@contentstack/venus-components'
import ContentstackAppSdk from '@contentstack/app-sdk'

const PRODUCT = 'product'
const FIELDS = Object.freeze({
  title: 'title',
  category: 'category',
  dynamic_url: 'dynamic_url',
})

function App() {
  const [error, setError] = useState<any>(null)
  const [app, setApp] = useState({} as any)
  const [url, setUrl] = useState('')

  const initializeApp = useCallback(async () => {
    if (app) {
      const customField = await app?.location?.CustomField
      const entry = customField?.entry

      setUrl(entry.getData()?.[FIELDS.dynamic_url])
      customField.frame.updateHeight(30)

      entry.onChange((data: any) => {
        const url = constructUrl(data)
        setUrl(url)

        customField?.field?.setData(url)
        entry.getField('url')?.setData(url)
      })
    }
  }, [app])

  const constructUrl = (data: any) => {
    const productName = data?.[FIELDS.title] ?? ''
    const formattedProductName = productName.split(' ').join('-').toLowerCase()
    const category = data?.[FIELDS.category] ?? ''
    return `/${PRODUCT}/${category}/${formattedProductName}`
  }

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    if (self === top) {
      const errorMessage = 'This extension can only be used in Contentstack'
      setError(errorMessage)
    } else {
      ContentstackAppSdk.init().then((appSdk) => {
        setApp(appSdk)
        initializeApp()
      })
    }
  }, [initializeApp])

  return error ? (
    <h3>{error}</h3>
  ) : (
    <TextInput type="text" disabled value={url} />
  )
}

export default App
