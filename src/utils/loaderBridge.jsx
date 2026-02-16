let loaderInstance = null

export const setLoader = (instance) => {
  loaderInstance = instance
}

export const getLoader = () => loaderInstance
