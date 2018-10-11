import { bootstrap } from '@scoutgg/widgets'
import { hyper as renderer } from '@scoutgg/widgets/cjs/renderers/hyper'
import hyper from 'hyperhtml'

// Import the components you want to use
import './components/flash-cards/flash-cards'

// Bootstrap Widgets (Start it)
bootstrap([
  renderer(hyper)
])
