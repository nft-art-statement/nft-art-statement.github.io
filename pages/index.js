import tw from 'twin.macro'

const Container = tw.div`w-full h-screen bg-red-500`

const Home = (props) => {
  console.log(props)
  return (
    <Container>

    </Container>
  )
}

export default Home

export const getServerSideProps = async () => {

}
