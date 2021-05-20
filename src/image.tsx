import { useContainerStyle } from 'native-x-theme'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ImageProps,
  ImagePropsWithFill,
  ImagePropsWithWidthAndHeight,
  useDeepMemo,
} from './image-props'

import { Platform } from 'react-native'

export const ImageComponent =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Platform.OS === 'web' ? require('react-native').Image : require('react-native-fast-image')

export const Image = React.memo((props: ImageProps) => {
  const initialized = useRef(false)
  const {
    source: originalSource,
    fallback = true,
    fallbackSource,
    resizeMode = 'cover',
    width,
    height,
    fill,
    ...imageProps
  } = props as ImagePropsWithWidthAndHeight & ImagePropsWithFill
  const [key, setKey] = useState(Math.random())
  const [source, setSource] = useState<any>(originalSource ?? fallbackSource)
  const containerStyle = useContainerStyle(props)
  const style = useMemo(
    () => [
      ...containerStyle,
      fill ? { width: '100%', height: '100%' } : { width, height },
      props.style,
    ],
    [containerStyle, fill, height, props.style, width],
  )

  const uri = useDeepMemo(() => originalSource, { originalSource })

  useEffect(() => {
    setSource(uri)
    if (initialized.current) {
      setKey(Math.random())
    }
    initialized.current = uri != null && uri !== ''
  }, [uri])

  const onError = useCallback(() => {
    if (fallback) {
      setSource(fallbackSource)
      setKey(Math.random())
    }
  }, [fallback, fallbackSource])

  return (
    <ImageComponent
      key={key}
      {...imageProps}
      style={style as any}
      fallback={false}
      resizeMode={resizeMode}
      source={source}
      onError={onError}
    />
  )
})
