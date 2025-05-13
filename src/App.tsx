import './App.css'
import PageTree from './components/PageTree/PageTree'
import Properties from './components/Properties'


function App() {
  // Get the page tree.
  // const { pageTree } = usePageTree();

  return (
    <main className="w-screen h-screen flex">
      <PageTree />

      <Properties />
    </main>
  )
}

export default App
