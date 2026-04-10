export function createGreeting(name: string = 'FaasJS'): { message: string } {
  return {
    message: `Hello, ${name}!`,
  }
}
