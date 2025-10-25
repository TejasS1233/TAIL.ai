class ExampleAgent:
    def __init__(self, name: str = 'py-example'):
        self.name = name

    def run(self, prompt: str):
        # simple sync implementation for now
        return {
            'agent': self.name,
            'input': prompt,
            'output': f'ECHO_PY: {prompt[:1024]}',
            'len': len(prompt),
        }
