import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import atmospherVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'


const canvasContainer = document.querySelector("#canvasContainer")
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth/ canvasContainer.offsetHeight,
  0.1,
  1000
)
camera.position.z = 15

const renderer = new THREE.WebGLRenderer({ 
  canvas: document.querySelector("canvas"),
  antialias: true })

renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)
//document.body.appendChild(renderer.domElement)

// Sphere Mesh

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load('./globe.jpg')
      }
    },
    vertexShader,
    fragmentShader,
  })
)
// scene.add(sphere)
//create atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader : atmospherVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
)
atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
})

const starVertices = []
for(let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 2000
  const y = (Math.random() - 0.5) * 2000
  const z = -Math.random() * 3000
  starVertices.push(x,y,z)
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

const mouse = {
  x : undefined,
  y : undefined,
}
function animate() {
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
  sphere.rotation.y += 0.005
  // group.rotation.y = mouse.x * 0.1
  gsap.to(group.rotation, {
    y: mouse.x * 0.4,
    duration: 2,
  })
}

animate()

addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1
  mouse.y = (e.clientY / innerHeight) * 2 + 1
})