import { useEffect, useRef } from 'react'

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 v_uv;
  uniform vec2 u_pointer;
  uniform float u_time;

  void main() {
    vec2 p = v_uv * 2.0 - 1.0;
    float radius = length(p);
    if (radius > 1.0) discard;

    float z = sqrt(max(0.0, 1.0 - dot(p, p)));
    vec3 normal = normalize(vec3(p.x, -p.y, z));
    vec3 light = normalize(vec3(
      -0.42 + u_pointer.x * 0.34,
      0.58 - u_pointer.y * 0.28,
      1.0
    ));

    float diffuse = max(dot(normal, light), 0.0);
    float rim = pow(1.0 - z, 2.7);
    vec3 reflected = reflect(-light, normal);
    float specular = pow(max(dot(reflected, vec3(0.0, 0.0, 1.0)), 0.0), 42.0);
    float pulse = 0.94 + sin(u_time * 0.45) * 0.06;

    vec3 deepViolet = vec3(0.09, 0.035, 0.20);
    vec3 violet = vec3(0.39, 0.18, 0.86);
    vec3 lavender = vec3(0.78, 0.70, 1.0);
    vec3 color = mix(deepViolet, violet, diffuse * 0.82);
    color += lavender * specular * 0.78;
    color += vec3(0.34, 0.23, 0.82) * rim * pulse;

    float edge = smoothstep(1.0, 0.86, radius);
    float alpha = edge * (0.42 + diffuse * 0.26 + rim * 0.34);
    gl_FragColor = vec4(color, alpha);
  }
`

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function WebGLOrb({
  active,
  reduced,
}: {
  active: boolean
  reduced: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active || reduced) return
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    if (!gl) return

    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vertex || !fragment) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const position = gl.getAttribLocation(program, 'a_position')
    const pointerUniform = gl.getUniformLocation(program, 'u_pointer')
    const timeUniform = gl.getUniformLocation(program, 'u_time')
    gl.useProgram(program)
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const pointer = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    const hero = parent.closest('[data-hero]') as HTMLElement | null

    const onPointerMove = (event: PointerEvent) => {
      const rect = hero?.getBoundingClientRect()
      if (!rect) return
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }
    const onPointerLeave = () => {
      target.x = 0
      target.y = 0
    }
    hero?.addEventListener('pointermove', onPointerMove, { passive: true })
    hero?.addEventListener('pointerleave', onPointerLeave)

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(parent)
    resize()

    const started = performance.now()
    let raf = 0
    const render = (now: number) => {
      pointer.x += (target.x - pointer.x) * 0.055
      pointer.y += (target.y - pointer.y) * 0.055
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(pointerUniform, pointer.x, pointer.y)
      gl.uniform1f(timeUniform, (now - started) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      hero?.removeEventListener('pointermove', onPointerMove)
      hero?.removeEventListener('pointerleave', onPointerLeave)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [active, reduced])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full rounded-full"
      style={{ mixBlendMode: 'screen', opacity: 0.82 }}
      aria-hidden
    />
  )
}
