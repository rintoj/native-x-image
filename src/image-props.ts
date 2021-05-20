import { equal as isEqual } from '@wry/equality'
import { BackgroundColorStyleProps, BorderRadiusStyleProps } from 'native-x-theme'
import { useRef } from 'react'
import {
  AccessibilityProps,
  ImageLoadEventData,
  ImageStyle,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleProp,
} from 'react-native'

export declare type Priority = 'low' | 'normal' | 'high'

export declare type Source = {
  uri?: string
  headers?: {
    [key: string]: string
  }
  priority?: Priority
  cache?: Cache
}

export interface OnLoadEvent {
  nativeEvent: {
    width: number
    height: number
  }
}
export interface OnProgressEvent {
  nativeEvent: {
    loaded: number
    total: number
  }
}

export declare type ResizeMode = 'contain' | 'cover' | 'stretch' | 'center'

export interface BasicImageProps
  extends BorderRadiusStyleProps,
    BackgroundColorStyleProps,
    AccessibilityProps {
  source: Source | number
  resizeMode?: ResizeMode
  fallback?: boolean
  onLoadStart?(): void
  onProgress?(event: OnProgressEvent): void
  onError?(): void
  onLoadEnd?(): void
  onLayout?: (event: LayoutChangeEvent) => void
  style?: StyleProp<ImageStyle>
  tintColor?: number | string
  testID?: string
  children?: React.ReactNode
  fallbackSource?: Source
}

export interface FastImageOnlyProps {
  onLoad?: (event: OnLoadEvent) => void
}

export interface RNImageOnlyProps {
  onLoad?: (event: NativeSyntheticEvent<ImageLoadEventData>) => void
}

export interface ImagePropsWithWidthAndHeight extends BasicImageProps {
  width: number
  height: number
}

export interface ImagePropsWithFill extends BasicImageProps {
  fill: boolean
}

export type ImageProps = ImagePropsWithWidthAndHeight | ImagePropsWithFill

export function useDeepMemo<TKey, TValue>(memoFn: () => TValue, key: TKey): TValue {
  const ref = useRef<{ key: TKey; value: TValue }>()
  if (!ref.current || !isEqual(key, ref.current.key)) {
    ref.current = { key, value: memoFn() }
  }
  return ref.current.value
}
