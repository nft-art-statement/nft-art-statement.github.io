import {styled} from 'twin.macro'
import ReactMarkdown from 'react-markdown'

const Container = styled.div(() => [
  `h1 {
    font-size: 2.5rem;
    font-weight: bold;
    @media screen and (max-width: 768px) {
      font-size: 2rem;
    }
  }
  h2 {
    font-size: 2rem;
    margin-top: 2rem;
    @media screen and (max-width: 768px) {
      font-size: 1.3rem;
      margin-top: 1.3rem;
    }
  }
  p {
    font-size: 1.2rem;
    margin-top: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
    @media screen and (max-width: 768px) {
      font-size: 1rem;
      margin-top: 1rem;
      padding-left: 1rem;
      padding-right: 1rem;
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
    }
    @media screen and (max-width: 768px) {
      font-size: 1rem;
      margin-top: 1rem;
      padding-left: 1.5rem;
      padding-right: 1rem;
    }
  }
  hr {
    margin-top: 3rem;
    margin-bottom: 3rem;
    @media screen and (max-width: 768px) {
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
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