import { bootstrap } from '@scoutgg/widgets'
import { hyper as renderer } from '@scoutgg/widgets/esm/renderers/hyper'
import hyper from 'hyperhtml/esm'

import './components/hello/hello'
import './components/counter/counter'

bootstrap([
  renderer(hyper) // tell widgets how to render component
])
