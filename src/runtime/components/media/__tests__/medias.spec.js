import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as medias from '../medias'

describe('medias.js', () => {
  describe('isLottieAnimation', () => {
    it('returns true for valid lottie JSON', () => {
      const validLottie = {
        v: '5.7.0',
        fr: 60,
        ip: 0,
        op: 180,
        w: 100,
        h: 100,
        layers: [],
      }

      expect(medias.isLottieAnimation(validLottie)).toBe(true)
    })

    it('returns false when required keys are missing', () => {
      const invalidLottie = {
        v: '5.7.0',
        fr: 60,
        w: 100,
        h: 100,
      }

      expect(medias.isLottieAnimation(invalidLottie)).toBe(false)
    })

    it('returns false for null', () => {
      expect(medias.isLottieAnimation(null)).toBe(false)
    })

    it('returns false for non-object', () => {
      expect(medias.isLottieAnimation('string')).toBe(false)
      expect(medias.isLottieAnimation(123)).toBe(false)
    })
  })

  describe('isDotLottieFile', () => {
    it('returns true for .lottie extension', () => {
      expect(medias.isDotLottieFile('animation.lottie')).toBe(true)
      expect(medias.isDotLottieFile('test.lottie')).toBe(true)
      expect(medias.isDotLottieFile('my-animation.lottie')).toBe(true)
    })

    it('returns true for .lottie extension in uppercase', () => {
      expect(medias.isDotLottieFile('animation.LOTTIE')).toBe(true)
      expect(medias.isDotLottieFile('test.Lottie')).toBe(true)
    })

    it('returns true for .lottie extension in mixed case', () => {
      expect(medias.isDotLottieFile('animation.Lottie')).toBe(true)
      expect(medias.isDotLottieFile('test.lOtTiE')).toBe(true)
    })

    it('returns false for .json extension', () => {
      expect(medias.isDotLottieFile('animation.json')).toBe(false)
      expect(medias.isDotLottieFile('test.json')).toBe(false)
    })

    it('returns false for other extensions', () => {
      expect(medias.isDotLottieFile('animation.gif')).toBe(false)
      expect(medias.isDotLottieFile('test.png')).toBe(false)
      expect(medias.isDotLottieFile('file.txt')).toBe(false)
    })

    it('returns false for null or undefined', () => {
      expect(medias.isDotLottieFile(null)).toBe(false)
      expect(medias.isDotLottieFile(undefined)).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(medias.isDotLottieFile('')).toBe(false)
    })

    it('returns false for non-string values', () => {
      expect(medias.isDotLottieFile(123)).toBe(false)
      expect(medias.isDotLottieFile({})).toBe(false)
      expect(medias.isDotLottieFile([])).toBe(false)
    })

    it('handles file paths correctly', () => {
      expect(medias.isDotLottieFile('/path/to/animation.lottie')).toBe(true)
      expect(medias.isDotLottieFile('C:\\path\\to\\animation.lottie')).toBe(true)
      expect(medias.isDotLottieFile('https://example.com/animation.lottie')).toBe(true)
    })
  })

  describe('initLottieFromHtml', () => {
    beforeEach(() => {
      window.lottie = {
        loadAnimation: vi.fn(),
      }
      document.body.innerHTML = ''
    })

    afterEach(() => {
      delete window.lottie
    })

    it('initializes lottie animations from html elements', () => {
      const div = document.createElement('div')
      div.setAttribute('lottie-id', 'test-id')
      div.setAttribute('media-type', 'lottie')
      div.setAttribute('src', 'https://example.com/animation.json')
      document.body.appendChild(div)

      medias.initLottieFromHtml(document.body)

      expect(window.lottie.loadAnimation).toHaveBeenCalled()
    })

    it('does nothing if no lottie divs found', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      medias.initLottieFromHtml(document.body)

      expect(window.lottie.loadAnimation).not.toHaveBeenCalled()
    })

    it('handles errors gracefully', () => {
      window.lottie = null

      const div = document.createElement('div')
      div.setAttribute('lottie-id', 'test-id')
      div.setAttribute('media-type', 'lottie')
      document.body.appendChild(div)

      expect(() => medias.initLottieFromHtml(document.body)).not.toThrow()
    })
  })

  describe('initDotLottieFromHtml', () => {
    beforeEach(() => {
      window.DotLottiePlayer = vi.fn().mockImplementation(() => ({
        load: vi.fn(),
        loop: true,
        autoplay: true,
      }))
      document.body.innerHTML = ''
    })

    afterEach(() => {
      delete window.DotLottiePlayer
    })

    it('initializes dotlottie animations from html elements', () => {
      const div = document.createElement('div')
      div.setAttribute('lottie-id', 'test-id')
      div.setAttribute('media-type', 'dotlottie')
      div.setAttribute('src', 'https://example.com/animation.lottie')
      document.body.appendChild(div)

      medias.initDotLottieFromHtml(document.body)

      expect(window.DotLottiePlayer).toHaveBeenCalled()
    })

    it('does nothing if no dotlottie divs found', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      medias.initDotLottieFromHtml(document.body)

      expect(window.DotLottiePlayer).not.toHaveBeenCalled()
    })

    it('handles errors gracefully', () => {
      window.DotLottiePlayer = null

      const div = document.createElement('div')
      div.setAttribute('lottie-id', 'test-id')
      div.setAttribute('media-type', 'dotlottie')
      document.body.appendChild(div)

      expect(() => medias.initDotLottieFromHtml(document.body)).not.toThrow()
    })
  })
})
