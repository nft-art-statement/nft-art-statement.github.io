import {styled} from 'twin.macro'
import ReactMarkdown from 'react-markdown'

const Container = styled.div(() => [
  `h1 {
    font-size: 2.5rem;
    font-weight: bold;
    @media screen and () {
      
    }
  }
  h2 {
    font-size: 2rem;
    margin-top: 2rem;
    @media screen and () {
      
    }
  }
  p {
    font-size: 1.2rem;
    margin-top: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
    @media screen and () {
      
    }
  }
  ul {
    font-size: 1.2rem;
    margin-top: 2rem;
    padding-left: 3rem;
    padding-right: 2rem;
    list-style-type: disc;
    li {
      margin-bottom: 1rem;
      font-weight: bold;
    }
  }
  hr {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
  `
])

export const Markdown = ({contents}) => {
  return (
    <Container>
      <ReactMarkdown>{contents}</ReactMarkdown>
    </Container>
  )
}