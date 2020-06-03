<h1 align="center">Welcome to d3-chart-callchain 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
</p>

> 用于服务与服务之间的调用关系

![image](https://github.com/twinkle77/d3-chart-callchain/blob/master/examples/demo.gif)

## Usage

```javascript
import Callchain from 'd3-chart-callchain'
const instance = new Callchain(document.body, {
  ...options,
  data: []
})

// render
instance.render()

// destory
instance.destory()

// update
instance.setOptions(newData)
```

## Author

👤 **twinkle77**

* Github: [@twinkle77](https://github.com/twinkle77)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
