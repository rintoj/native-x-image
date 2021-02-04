import { equal as isEqual } from '@wry/equality'
import {
  BackgroundColorStyleProps,
  BorderRadiusStyleProps,
  useContainerStyle,
} from 'native-x-theme'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FastImage, { FastImageProps, Source } from 'react-native-fast-image'

function useDeepMemo<TKey, TValue>(memoFn: () => TValue, key: TKey): TValue {
  const ref = useRef<{ key: TKey; value: TValue }>()
  if (!ref.current || !isEqual(key, ref.current.key)) {
    ref.current = { key, value: memoFn() }
  }
  return ref.current.value
}

interface BasicImageProps
  extends FastImageProps,
    BorderRadiusStyleProps,
    BackgroundColorStyleProps {
  fallbackSource?: Source
}

interface ImagePropsWithWidthAndHeight extends BasicImageProps {
  width: number
  height: number
}

interface ImagePropsWithFill extends BasicImageProps {
  fill: boolean
}

type ImageProps = ImagePropsWithWidthAndHeight | ImagePropsWithFill

export const Image = React.memo((props: ImageProps) => {
  const initialized = useRef(false)
  const {
    source: originalSource,
    fallbackSource,
    resizeMode = 'cover',
    width,
    height,
    fill,
    ...imageProps
  } = props as ImagePropsWithWidthAndHeight & ImagePropsWithFill
  const [key, setKey] = useState(Math.random())
  const [source, setSource] = useState<any>(originalSource || fallbackSource)
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
    setSource(fallbackSource)
  }, [fallbackSource])

  return (
    <FastImage
      key={key}
      {...imageProps}
      style={style as any}
      fallback={fallbackSource != null}
      resizeMode={resizeMode}
      source={source}
      onError={onError}
    />
  )
})
