<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)
const failed = ref(false)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let THREE
let renderer
let scene
let camera
let animationFrame
let resizeObserver
let visibilityHandler
let lastFrame = 0
let openingAt = 0
let disposed = false
let petals
let hearts
let dust
let mandala
let leftDoor
let rightDoor
const disposableObjects = []

let gold
let brightGold
let maroon
let green
let stone
let petalMaterial
let heartMaterial

function track(object) {
  disposableObjects.push(object)
  return object
}

function addMesh(geometry, material, parent, position = [0, 0, 0], rotation = [0, 0, 0], scale) {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(...position)
  mesh.rotation.set(...rotation)
  if (scale) mesh.scale.set(...scale)
  mesh.castShadow = true
  mesh.receiveShadow = true
  parent.add(mesh)
  return track(mesh)
}

function makeColumn(x, z, height = 4.6) {
  const column = new THREE.Group()
  column.position.set(x, 0, z)
  scene.add(column)
  const shaftHeight = height * 0.67
  const shaftY = 0.32 + shaftHeight / 2
  addMesh(new THREE.CylinderGeometry(0.31, 0.4, 0.25, 16), gold, column, [0, 0.12, 0])
  addMesh(new THREE.CylinderGeometry(0.23, 0.28, shaftHeight, 14), stone, column, [0, shaftY, 0])
  addMesh(new THREE.CylinderGeometry(0.31, 0.23, 0.2, 16), gold, column, [0, shaftY + shaftHeight / 2, 0])
  addMesh(new THREE.CylinderGeometry(0.4, 0.3, 0.2, 16), brightGold, column, [0, shaftY + shaftHeight / 2 + 0.1, 0])

  for (let band = 0; band < 4; band += 1) {
    const y = 0.42 + band * (shaftHeight / 4)
    addMesh(new THREE.TorusGeometry(0.24 + band * 0.003, 0.018, 6, 20), brightGold, column, [0, y, 0], [Math.PI / 2, 0, 0])
  }

  for (let motif = 0; motif < 6; motif += 1) {
    const angle = (motif / 6) * Math.PI * 2
    const relief = addMesh(new THREE.OctahedronGeometry(0.1, 0), gold, column, [
      Math.cos(angle) * 0.235,
      shaftY + Math.sin(motif * 1.9) * 0.12,
      Math.sin(angle) * 0.235,
    ])
    relief.scale.set(0.6, 1.4, 0.6)
  }
}

function makeArch() {
  const shape = new THREE.EllipseCurve(0, 0, 2.45, 1.3, Math.PI, 0, false, 0)
  const points = shape.getPoints(48).map((point) => new THREE.Vector3(point.x, point.y + 4.62, 0))
  const archCurve = new THREE.CatmullRomCurve3(points)
  addMesh(new THREE.TubeGeometry(archCurve, 64, 0.095, 10, false), brightGold, scene, [0, 0, 0])
  addMesh(new THREE.TubeGeometry(archCurve, 64, 0.025, 6, false), gold, scene, [0, 0, -0.02])
}

function makeThoranam() {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-3.9, 4.45, 0.4),
    new THREE.Vector3(0, 3.35, 0.4),
    new THREE.Vector3(3.9, 4.45, 0.4),
  )
  addMesh(new THREE.TubeGeometry(curve, 40, 0.024, 6, false), gold, scene)
  const leafGeometry = new THREE.SphereGeometry(0.15, 8, 8)
  for (let index = 0; index < 19; index += 1) {
    const t = index / 18
    const point = curve.getPoint(t)
    const leaf = addMesh(leafGeometry, green, scene, [point.x, point.y - 0.12, point.z])
    leaf.scale.set(0.52, 1.3, 0.12)
    leaf.rotation.z = (t - 0.5) * 0.72
  }

  const jasmine = new THREE.MeshStandardMaterial({ color: 0xfff5dc, roughness: 0.46 })
  for (let chain = 0; chain < 5; chain += 1) {
    const x = -2.35 + chain * 1.175
    const drop = chain % 2 === 0 ? 0.84 : 0.55
    const garlandCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x - 0.27, 4.12, 0.45),
      new THREE.Vector3(x, 4.12 - drop, 0.48),
      new THREE.Vector3(x + 0.27, 4.12, 0.45),
    )
    addMesh(new THREE.TubeGeometry(garlandCurve, 16, 0.035, 6, false), jasmine, scene)
    for (let blossom = 0; blossom < 5; blossom += 1) {
      const bead = garlandCurve.getPoint(blossom / 4)
      addMesh(new THREE.SphereGeometry(0.065, 7, 7), jasmine, scene, bead.toArray())
    }
  }
}

function makeLamp(x, z) {
  const lamp = new THREE.Group()
  lamp.position.set(x, 0, z)
  scene.add(lamp)
  addMesh(new THREE.CylinderGeometry(0.42, 0.48, 0.08, 20), gold, lamp, [0, 0.12, 0])
  addMesh(new THREE.CylinderGeometry(0.07, 0.11, 0.78, 12), brightGold, lamp, [0, 0.53, 0])
  addMesh(new THREE.CylinderGeometry(0.23, 0.1, 0.07, 18), brightGold, lamp, [0, 0.95, 0])
  addMesh(new THREE.ConeGeometry(0.11, 0.38, 12), new THREE.MeshBasicMaterial({ color: 0xffbd4d }), lamp, [0, 1.17, 0])
  const glow = new THREE.PointLight(0xffc15b, 3.2, 4)
  glow.position.set(0, 1.35, 0.12)
  lamp.add(glow)
}

function makeBell(x, y, z) {
  addMesh(new THREE.CylinderGeometry(0.015, 0.025, 0.36, 8), gold, scene, [x, y + 0.27, z])
  addMesh(new THREE.SphereGeometry(0.14, 12, 9, 0, Math.PI * 2, 0, Math.PI * 0.58), brightGold, scene, [x, y, z])
  addMesh(new THREE.SphereGeometry(0.035, 8, 8), gold, scene, [x, y - 0.14, z])
}

function makeKalasam() {
  addMesh(new THREE.CylinderGeometry(0.1, 0.27, 0.28, 16), brightGold, scene, [0, 6.17, -0.1])
  addMesh(new THREE.SphereGeometry(0.2, 16, 12), gold, scene, [0, 6.39, -0.1], [0, 0, 0], [0.8, 1.15, 0.8])
  addMesh(new THREE.ConeGeometry(0.06, 0.36, 10), brightGold, scene, [0, 6.68, -0.1])
}

function makeDoors() {
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x51233f, metalness: 0.4, roughness: 0.4 })
  leftDoor = new THREE.Group()
  rightDoor = new THREE.Group()
  leftDoor.position.set(-1.05, 0, 1.72)
  rightDoor.position.set(1.05, 0, 1.72)
  scene.add(leftDoor, rightDoor)

  for (const [pivot, centerX] of [[leftDoor, 0.52], [rightDoor, -0.52]]) {
    const panel = addMesh(new THREE.BoxGeometry(1.05, 2.6, 0.14), doorMaterial, pivot, [centerX, 1.58, 0])
    panel.castShadow = true
    for (let inset = 0; inset < 2; inset += 1) {
      const y = 0.83 + inset * 0.75
      addMesh(new THREE.BoxGeometry(0.75, 0.56, 0.05), gold, pivot, [centerX, y, 0.1])
    }
    addMesh(new THREE.SphereGeometry(0.055, 9, 8), brightGold, pivot, [centerX + Math.sign(centerX) * -0.34, 1.58, 0.12])
  }
}

function makeKolam() {
  const floor = addMesh(new THREE.CircleGeometry(5.1, 48), new THREE.MeshStandardMaterial({ color: 0x28182f, roughness: 0.8 }), scene, [0, 0.015, 0], [-Math.PI / 2, 0, 0])
  floor.receiveShadow = true
  mandala = new THREE.Group()
  scene.add(mandala)
  for (let radius = 0.8; radius <= 3.4; radius += 0.52) {
    addMesh(new THREE.TorusGeometry(radius, 0.012, 5, 96), gold, mandala, [0, 0.06, 0], [Math.PI / 2, 0, 0])
  }

  for (let index = 0; index < 12; index += 1) {
    const angle = (index / 12) * Math.PI * 2
    const petal = addMesh(new THREE.SphereGeometry(0.47, 10, 8), brightGold, mandala, [
      Math.cos(angle) * 1.55,
      0.075,
      Math.sin(angle) * 1.55,
    ])
    petal.scale.set(0.34, 0.035, 1)
    petal.rotation.y = -angle
  }
}

function makeFloatingPetals() {
  const count = window.innerWidth < 700 ? 18 : 34
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.quadraticCurveTo(-0.19, 0.16, -0.12, 0.35)
  shape.quadraticCurveTo(0, 0.53, 0.12, 0.35)
  shape.quadraticCurveTo(0.19, 0.16, 0, 0)
  const geometry = new THREE.ShapeGeometry(shape, 8)
  geometry.translate(0, -0.26, 0)
  petals = new THREE.InstancedMesh(geometry, petalMaterial, count)
  petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  petals.userData.items = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 9,
    y: Math.random() * 7,
    z: (Math.random() - 0.5) * 5,
    speed: 0.16 + Math.random() * 0.35,
    drift: 0.12 + Math.random() * 0.38,
    spin: (Math.random() - 0.5) * 1.8,
    phase: Math.random() * Math.PI * 2,
    scale: 0.3 + Math.random() * 0.42,
  }))
  scene.add(petals)
  track(petals)

  const dummy = new THREE.Object3D()
  petals.userData.update = (elapsed, delta) => {
    for (let index = 0; index < count; index += 1) {
      const item = petals.userData.items[index]
      item.y -= item.speed * delta
      item.x += Math.sin(elapsed * 0.38 + item.phase) * item.drift * delta
      if (item.y < -0.7) {
        item.y = 6 + Math.random() * 2
        item.x = (Math.random() - 0.5) * 9
      }
      dummy.position.set(item.x, item.y, item.z)
      dummy.rotation.set(0, elapsed * 0.24 + item.phase, item.spin * elapsed)
      dummy.scale.setScalar(item.scale)
      dummy.updateMatrix()
      petals.setMatrixAt(index, dummy.matrix)
    }
    petals.instanceMatrix.needsUpdate = true
  }
}

function makeFloatingHearts() {
  const count = window.innerWidth < 700 ? 8 : 15
  const shape = new THREE.Shape()
  shape.moveTo(0, -0.28)
  shape.bezierCurveTo(-0.15, -0.12, -0.49, 0.12, -0.4, 0.39)
  shape.bezierCurveTo(-0.31, 0.69, -0.06, 0.67, 0, 0.46)
  shape.bezierCurveTo(0.06, 0.67, 0.31, 0.69, 0.4, 0.39)
  shape.bezierCurveTo(0.49, 0.12, 0.15, -0.12, 0, -0.28)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.025,
    bevelThickness: 0.025,
    steps: 1,
  })
  geometry.center()
  hearts = new THREE.InstancedMesh(geometry, heartMaterial, count)
  hearts.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  hearts.userData.items = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 8,
    y: Math.random() * 6.4,
    z: (Math.random() - 0.5) * 3,
    speed: 0.08 + Math.random() * 0.13,
    phase: Math.random() * Math.PI * 2,
    scale: 0.13 + Math.random() * 0.11,
    spin: (Math.random() - 0.5) * 0.28,
  }))
  scene.add(hearts)
  track(hearts)

  const dummy = new THREE.Object3D()
  hearts.userData.update = (elapsed, delta) => {
    for (let index = 0; index < count; index += 1) {
      const item = hearts.userData.items[index]
      item.y += item.speed * delta
      if (item.y > 7.3) {
        item.y = -0.7
        item.x = (Math.random() - 0.5) * 8
      }
      dummy.position.set(item.x + Math.sin(elapsed * 0.3 + item.phase) * 0.16, item.y, item.z)
      dummy.rotation.set(0, item.spin + Math.sin(elapsed * 0.28 + item.phase) * 0.12, Math.sin(elapsed * 0.2 + item.phase) * 0.08)
      dummy.scale.setScalar(item.scale * (1 + Math.sin(elapsed * 1.2 + item.phase) * 0.08))
      dummy.updateMatrix()
      hearts.setMatrixAt(index, dummy.matrix)
    }
    hearts.instanceMatrix.needsUpdate = true
  }
}

function makeGoldenDust() {
  const count = window.innerWidth < 700 ? 110 : 230
  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count)
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 11
    positions[index * 3 + 1] = Math.random() * 7
    positions[index * 3 + 2] = (Math.random() - 0.5) * 8
    velocities[index] = 0.08 + Math.random() * 0.22
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({ color: 0xf5d779, size: 0.035, transparent: true, opacity: 0.77, depthWrite: false })
  dust = new THREE.Points(geometry, material)
  dust.userData.velocities = velocities
  scene.add(dust)
  track(dust)
}

function disposeMaterial(material) {
  if (Array.isArray(material)) material.forEach((item) => item.dispose())
  else material?.dispose()
}

function animate(now) {
  if (disposed || !renderer || document.hidden) return
  animationFrame = window.requestAnimationFrame(animate)
  if (now - lastFrame < (window.innerWidth < 700 ? 1000 / 30 : 1000 / 45)) return
  const delta = Math.min((now - (lastFrame || now)) / 1000, 0.05)
  lastFrame = now
  const elapsed = now / 1000

  if (!reducedMotion) {
    petals?.userData.update(elapsed, delta)
    hearts?.userData.update(elapsed, delta)
    const positions = dust?.geometry.attributes.position
    const velocities = dust?.userData.velocities
    if (positions && velocities) {
      for (let index = 0; index < velocities.length; index += 1) {
        const yIndex = index * 3 + 1
        positions.array[yIndex] += velocities[index] * delta
        if (positions.array[yIndex] > 6.8) positions.array[yIndex] = 0
      }
      positions.needsUpdate = true
    }
    if (openingAt) {
      const progress = Math.min((now - openingAt) / 1900, 1)
      const eased = 1 - (1 - progress) ** 3
      leftDoor.rotation.y = -eased * 1.34
      rightDoor.rotation.y = eased * 1.34
      camera.position.z = 8.7 - eased * 3.05
      camera.position.y = 2.45 + eased * 0.17
      if (progress === 1) openingAt = 0
    } else {
      camera.position.x = Math.sin(elapsed * 0.1) * 0.045
      camera.position.y = 2.45 + Math.sin(elapsed * 0.19) * 0.035
    }
    if (mandala) mandala.rotation.y = elapsed * 0.018
    camera.lookAt(0, 2.32, 0)
  }
  renderer.render(scene, camera)
}

function onResize() {
  if (!renderer || !canvas.value) return
  const width = canvas.value.clientWidth
  const height = canvas.value.clientHeight
  if (!width || !height) return
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.25 : 1.65))
}

function openDoors() {
  if (!renderer || reducedMotion) return
  openingAt = performance.now()
}

defineExpose({ openDoors, available: () => Boolean(renderer) })

onMounted(async () => {
  if (reducedMotion) return
  try {
    THREE = await import('three')
    if (disposed) return
    gold = new THREE.MeshStandardMaterial({ color: 0xc6a052, metalness: 0.83, roughness: 0.28 })
    brightGold = new THREE.MeshStandardMaterial({ color: 0xf0d48a, metalness: 0.78, roughness: 0.23 })
    maroon = new THREE.MeshStandardMaterial({ color: 0x49253f, metalness: 0.32, roughness: 0.46 })
    green = new THREE.MeshStandardMaterial({ color: 0x2a6846, metalness: 0.16, roughness: 0.58 })
    stone = new THREE.MeshStandardMaterial({ color: 0x60404f, metalness: 0.24, roughness: 0.58 })
    petalMaterial = new THREE.MeshStandardMaterial({
      color: 0xe9a5b4,
      emissive: 0x32121a,
      emissiveIntensity: 0.28,
      metalness: 0.04,
      roughness: 0.38,
      transparent: true,
      opacity: 0.66,
      side: THREE.DoubleSide,
    })
    heartMaterial = new THREE.MeshStandardMaterial({
      color: 0xd9899d,
      emissive: 0x40121c,
      emissiveIntensity: 0.28,
      metalness: 0.13,
      roughness: 0.34,
      side: THREE.DoubleSide,
    })
    renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: window.innerWidth > 700, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.25 : 1.65))
    renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight, false)
    renderer.shadowMap.enabled = window.innerWidth > 700
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x24101e, 0.033)
    camera = new THREE.PerspectiveCamera(42, canvas.value.clientWidth / canvas.value.clientHeight, 0.1, 100)
    camera.position.set(0, 2.45, 8.7)
    camera.lookAt(0, 2.32, 0)

    scene.add(new THREE.HemisphereLight(0xffe4ee, 0x261018, 2.25))
    const keyLight = new THREE.DirectionalLight(0xffd98b, 3.1)
    keyLight.position.set(-4, 8, 5)
    keyLight.castShadow = renderer.shadowMap.enabled
    keyLight.shadow.mapSize.set(1024, 1024)
    scene.add(keyLight)
    const fillLight = new THREE.PointLight(0xc25475, 15, 16)
    fillLight.position.set(0, 4.5, 2.8)
    scene.add(fillLight)
    const moonLight = new THREE.PointLight(0xb7a6ff, 8, 14)
    moonLight.position.set(3.2, 5.2, -2.1)
    scene.add(moonLight)

    const backdrop = addMesh(new THREE.PlaneGeometry(18, 12), maroon, scene, [0, 3.1, -3.4])
    backdrop.receiveShadow = true
    makeKolam()
    makeColumn(-3.05, -0.38)
    makeColumn(3.05, -0.38)
    makeColumn(-2.48, 0.12, 4.1)
    makeColumn(2.48, 0.12, 4.1)
    makeArch()
    makeThoranam()
    makeLamp(-3.63, 1.5)
    makeLamp(3.63, 1.5)
    makeBell(-2.3, 4.05, 0.55)
    makeBell(2.3, 4.05, 0.55)
    makeKalasam()
    makeDoors()
    makeFloatingPetals()
    makeFloatingHearts()
    makeGoldenDust()

    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(canvas.value)
    visibilityHandler = () => {
      if (document.hidden) window.cancelAnimationFrame(animationFrame)
      else {
        lastFrame = 0
        animationFrame = window.requestAnimationFrame(animate)
      }
    }
    document.addEventListener('visibilitychange', visibilityHandler)
    animationFrame = window.requestAnimationFrame(animate)
  } catch {
    failed.value = true
    renderer?.dispose()
    renderer = undefined
  }
})

onUnmounted(() => {
  disposed = true
  window.cancelAnimationFrame(animationFrame)
  if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler)
  resizeObserver?.disconnect()
  if (scene) {
    scene.traverse((object) => {
      if (object.geometry && !disposableObjects.includes(object)) object.geometry.dispose()
      if (object.material && !disposableObjects.includes(object)) disposeMaterial(object.material)
    })
  }
  disposableObjects.forEach((object) => {
    object.geometry?.dispose()
    disposeMaterial(object.material)
  })
  gold?.dispose()
  brightGold?.dispose()
  maroon?.dispose()
  green?.dispose()
  stone?.dispose()
  petalMaterial?.dispose()
  heartMaterial?.dispose()
  renderer?.dispose()
  renderer?.forceContextLoss()
})
</script>

<template>
  <canvas
    ref="canvas"
    class="temple-scene-canvas"
    :class="{ 'temple-scene-canvas--fallback': failed || reducedMotion }"
    aria-hidden="true"
  ></canvas>
</template>
