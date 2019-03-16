export function mockFileReader(content) {
  return jest.fn(function() {
    this.readAsText = (_) => {
      this.onload({ target: { result: content } });
    };
  });
};